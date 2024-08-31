import { model, models } from 'mongoose';
import moment from 'moment';

import usersSchema from '@/app/api/v1/(users)/users.model.js';
import httpStatus from '@/constants/httpStatus.constants.js';
import configuration from '@/configuration/configuration.js';
import databaseService from '@/service/database.service.js';
import EmailService from '@/service/email.service.js';

import getModelName from '@/utilities/getModelName';
import sendResponse from '@/utilities/sendResponse.js';
import validateEmail from '@/utilities/validateEmail.js';
import validatePassword from '@/utilities/validatePassword.js';
import createHashedPassword from '@/utilities/createHashedPassword.js';
import generateVerificationToken from '@/utilities/generateVerificationToken.js';
import prepareEmailContent from '@/shared/prepareEmailContent.js';
import prepareEmail from '@/shared/prepareEmail.js';
import incrementUse from '@/utilities/incrementUse';
import getEnvironmentByName from '@/utilities/getEnvironmentByName';
import getDefaultValueByName from '@/utilities/getDefaultValueByName';

/**
 * Handles the user registration process, including validating the provided data, creating a new user, and sending a verification email.
 *
 * @async
 * @function POST
 * @param {Request} request - The incoming request object, containing the user's registration data.
 * @returns {Promise<Response>} - A Promise that resolves to an HTTP response, indicating the outcome of the registration process.
 *
 * @throws {Error} - If an error occurs during the registration process, an appropriate error message is logged, and a response with the relevant status code is returned.
 *
 * @description
 * This function performs the following steps:
 * 1. Connects to the database service.
 * 2. Increments the usage count of the authentication module.
 * 3. Extracts and validates the user data from the request body, including email and password validation.
 * 4. Checks if the email is already registered as a user.
 * 5. Validates the user's date of birth format and converts it using `moment`.
 * 6. Generates a verification token and prepares the user data for saving.
 * 7. Creates a new user in the database and sends a verification email to the provided email address.
 * 8. Returns an HTTP response indicating the success or failure of the registration process.
 */
export const POST = async (request) => {
    console.debug('Starting user registration process');

    try {
        console.debug('Connecting to database service');
        await databaseService.connect();

        console.debug('Incrementing authentication module usage');
        await incrementUse();

        const userData = await request.json();
        console.debug(
            `Received user data: ${JSON.stringify(userData.siteName)}`
        );

        const prepareModelName = getModelName(userData.siteName);
        if (!prepareModelName) {
            return sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'Invalid model name. Only alphabets are allowed without any spaces, hyphens, or special characters.'
            );
        }

        const UsersModel =
            (await models.prepareModelName) ||
            model(prepareModelName, usersSchema);

        // console.debug(
        //     'Checking if email is registered as an admin:',
        //     userData.email
        // );
        // const existingAdmin = await AdminsModel.findOne({
        //     email: userData.email,
        // }).lean();
        // if (existingAdmin) {
        //     return sendResponse(
        //         request,
        //         false,
        //         httpStatus.FORBIDDEN,
        //         'This email address is already registered as an admin. Cannot be a user and admin at the same time.',
        //     );
        // }

        console.debug(
            'Checking if email is already registered as a user:',
            userData.email
        );
        const existingUser = await UsersModel.findOne({
            'emails.email': userData.email,
        }).lean();
        if (existingUser) {
            return sendResponse(
                request,
                false,
                httpStatus.CONFLICT,
                'This email address is already registered. Please log in or use the forgot password option if you need to recover your password.'
            );
        }

        console.debug('Validating email address:', userData.email);
        const emailValidationResult = await validateEmail(userData.email);
        if (emailValidationResult !== 'Valid') {
            return sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                emailValidationResult
            );
        }

        console.debug('Matching passwords');
        if (userData.password !== userData.confirmPassword) {
            return sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'The passwords you entered do not match. Please try again.'
            );
        }

        console.debug('Validating password');
        const passwordValidationResult = await validatePassword(
            userData.password
        );
        if (passwordValidationResult !== 'Valid') {
            return sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                passwordValidationResult
            );
        }

        console.debug('Validate and convert dateOfBirth using moment');
        if (!moment(userData.dateOfBirth, 'DD-MM-YYYY', true).isValid()) {
            return sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'Date of birth must be in the format DD-MM-YYYY and a valid date.'
            );
        }

        const dateOfBirth = moment(userData.dateOfBirth, 'DD-MM-YYYY').toDate();
        const passwordHash = await createHashedPassword(userData.password);
        console.debug('Generating verification token');
        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();
        console.debug('Verification token generated');

        // Construct the name object and email object
        const emailObject = {
            email: userData.email.toLowerCase(),
            isPrimaryEmail: true,
            isEmailVerified: false,
            emailVerifyToken,
            emailVerifyTokenExpires,
        };

        console.debug('Saving new user data');
        const newUser = await UsersModel.create({
            name: {
                first: userData.name,
            },
            image: {
                downloadLink: getDefaultValueByName('MALE'),
            },
            emails: [emailObject],
            dateOfBirth,
            passwordHash,
        });
        console.debug('User data saved successfully');

        console.debug('Preparing email content for verification');
        const subject = 'Confirm Your Email Address';
        let emailVerificationLink;
        let resendEmailVerificationLink;

        // Access the host information from the request
        const hostname = request.nextUrl.hostname;

        if (configuration.env === getEnvironmentByName('PRODUCTION')) {
            emailVerificationLink = `https://${hostname}/api/v1/auth/verify/${plainToken}`;
            resendEmailVerificationLink = `https://${hostname}/api/v1/auth/resend-verification/${newUser._id}`;
        } else {
            emailVerificationLink = `http://${hostname}:${configuration.port}/api/v1/auth/verify/${plainToken}`;
            resendEmailVerificationLink = `http://${hostname}:${configuration.port}/api/v1/auth/resend-verification/${newUser._id}`;
        }

        const emailData = {
            emailVerificationLink,
            resendEmailVerificationLink,
        };
        const {
            pageTitle,
            preheaderText,
            heroSection,
            mainSection,
            footerContent,
        } = prepareEmailContent(subject, emailData);

        console.debug('Connecting to email service');
        await EmailService.connect();

        console.debug('Sending verification email');
        await EmailService.sendEmail(
            userData.email,
            subject,
            prepareEmail(
                pageTitle,
                preheaderText,
                heroSection,
                mainSection,
                footerContent
            )
        );

        return sendResponse(
            request,
            true,
            httpStatus.CREATED,
            'User registered successfully. Please check your email for verification instructions.'
        );
    } catch (error) {
        console.debug('Connecting to database service');
        await databaseService.connect();

        console.debug('Incrementing authentication module usage despite error');
        await incrementUse();

        return sendResponse(
            request,
            false,
            httpStatus.INTERNAL_SERVER_ERROR,
            configuration.env !== getEnvironmentByName('PRODUCTION')
                ? error.message
                : 'Internal Server Error.'
        );
    }
};
