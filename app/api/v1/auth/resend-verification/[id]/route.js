import { model, models } from 'mongoose';

import usersSchema from '@/app/api/v1/(users)/users.schema.js';
import databaseService from '@/service/database.service.js';
import httpStatus from '@/constants/httpStatus.constants.js';
import EmailService from '@/service/email.service.js';
import configuration from '@/configuration/configuration.js';
import serverApiCall from '@/utilities/axios.server';

import getModelName from '@/utilities/getModelName';
import sendResponse from '@/utilities/sendResponse.js';
import generateVerificationToken from '@/utilities/generateVerificationToken.js';
import prepareEmailContent from '@/shared/prepareEmailContent.js';
import prepareEmail from '@/shared/prepareEmail.js';
import sendErrorResponse from '@/utilities/sendErrorResponse';
import getDataByCriteria from '@/utilities/getDataByCriteria';

/**
 * Handles the process of resending an email verification link to the user.
 *
 * @async
 * @function POST
 * @param {Request} request - The incoming request object, containing user data and the user ID.
 * @param {Object} context - The context object containing additional parameters such as the user ID.
 * @returns {Promise<Response>} - A Promise that resolves to an HTTP response, indicating the outcome of the resend email process.
 *
 * @throws {Error} - If an error occurs during the resend email process, an appropriate error message is logged, and a response with the relevant status code is returned.
 *
 * @description
 * This function performs the following steps:
 * 1. Connects to the database service.
 * 2. Increments the usage count of the authentication module.
 * 3. Extracts the user ID from the context and validates its presence.
 * 4. Retrieves and validates the user data from the request body.
 * 5. Determines the correct model name based on the `siteName` from the user data.
 * 6. Finds the user by their ID and checks if the primary email is already verified.
 * 7. Generates a new email verification token and updates the user's document.
 * 8. Constructs the email verification link and prepares the email content.
 * 9. Sends the verification email to the user's primary email address.
 * 10. Returns an HTTP response indicating the success or failure of the resend email process.
 */
export const POST = async (request, context) => {
    console.debug('Starting resend email process');

    try {
        console.debug('Connecting to database service');
        await databaseService.connect();

        const { params } = context;
        const id = params.id;

        if (!id) {
            return await sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'ID not provided.'
            );
        }

        const userData = await request.json();
        console.debug(
            `Received user data: ${JSON.stringify(userData.siteName)}`
        );

        const prepareModelName = getModelName(userData.siteName);
        if (!prepareModelName) {
            return await sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'Invalid model name. Only alphabets are allowed without any spaces, hyphens, or special characters.'
            );
        }

        const UsersModel =
            (await models.prepareModelName) ||
            model(prepareModelName, usersSchema);

        console.debug(`Looking up user with ID: ${id}`);
        const userDetails = await UsersModel.findById(id);
        if (!userDetails) {
            return await sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'User not found.'
            );
        }

        console.debug('Checking for primary email');
        const primaryEmail = userDetails.emails.find(
            (email) => email.isPrimaryEmail
        );
        if (!primaryEmail) {
            return await sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'No primary email found. Please contact support.'
            );
        }

        // Check if email is already verified
        if (primaryEmail.isEmailVerified) {
            return await sendResponse(
                request,
                false,
                httpStatus.FORBIDDEN,
                'This email address has already been verified.'
            );
        }

        // Generate verification token
        console.debug('Generating email verification token');
        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();
        console.debug('Generated email verification token and expiration date');

        console.debug(
            'Updating user document with with the verification token and expiry'
        );
        userDetails.emails = userDetails.emails.map((email) =>
            email.isPrimaryEmail
                ? {
                      ...email,
                      emailVerifyToken,
                      emailVerifyTokenExpires,
                  }
                : email
        );

        console.debug('Updating user document with verification token');
        await userDetails.save();
        console.debug('User document updated successfully');

        console.debug('Constructing email verification link');
        const hostname = request.nextUrl.hostname;

        const [environmentNameApiResponse, environmentNameDefaultResponse] =
            await Promise.all([
                serverApiCall.getData(
                    '/api/v1/dashboard/environments?name=PRODUCTION'
                ),
                getDataByCriteria('environments.json', 'name', 'PRODUCTION'),
            ]);

        let environmentNameProduction = new RegExp(
            environmentNameDefaultResponse
        );
        if (await environmentNameApiResponse?.data[0]?.value) {
            environmentNameProduction = new RegExp(
                environmentNameApiResponse?.data[0]?.value
            );
        }

        const emailVerificationLink =
            configuration.env === environmentNameProduction
                ? `https://${hostname}/api/v1/auth/resend-verification/${plainToken}`
                : `http://${hostname}:3000/api/v1/auth/resend-verification/${plainToken}`;
        console.debug(
            'Email verification link constructed:',
            emailVerificationLink
        );

        console.debug('Preparing email content');
        const emailContent = prepareEmailContent('Confirm Your Email Address', {
            link: emailVerificationLink,
        });

        console.debug('Connecting to email service');
        await EmailService.connect();

        console.debug('Sending email verification');
        await EmailService.sendEmail(
            primaryEmail.email,
            'Confirm Your Email Address',
            prepareEmail(emailContent)
        );
        console.debug('Email sent successfully');

        return await sendResponse(
            request,
            true,
            httpStatus.OK,
            'Verification email sent successfully.'
        );
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
};
