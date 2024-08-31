import { model, models } from 'mongoose';

import usersSchema from '@/app/api/v1/(users)/users.model';
import databaseService from '@/service/database.service.js';
import httpStatus from '@/constants/httpStatus.constants.js';
import EmailService from '@/service/email.service.js';
import configuration from '@/configuration/configuration.js';
import environment from '@/constants/environment.constants.js';
import contentTypeConstants from '@/constants/contentType.constants';

import getModelName from '@/utilities/getModelName';
import sendResponse from '@/utilities/sendResponse.js';
import prepareEmailContent from '@/shared/prepareEmailContent.js';
import prepareEmail from '@/shared/prepareEmail.js';
import comparePassword from '@/utilities/comparePassword.js';
import createAuthenticationToken from '@/utilities/createAuthenticationToken.js';
import incrementUse from '@/utilities/incrementUse';

/**
 * Handles user login requests by authenticating the user based on provided credentials.
 *
 * @async
 * @function POST
 * @param {Request} request - The incoming request object, containing user credentials and other data.
 * @returns {Promise<Response>} - A Promise that resolves to an HTTP response, indicating the outcome of the login process.
 *
 * @throws {Error} - If an error occurs during the login process, an appropriate error message is logged, and a response with the relevant status code is returned.
 *
 * @description
 * This function performs the following steps:
 * 1. Connects to the database service.
 * 2. Increments the usage count of the authentication module.
 * 3. Extracts and validates the user data from the request body.
 * 4. Determines the correct model name based on the `siteName` from the user data.
 * 5. Authenticates the user by verifying their email, account status, and password.
 * 6. If authentication is successful, an authentication token is generated, and the user's login success is recorded.
 * 7. Sends a confirmation email to the user's primary email address.
 * 8. Returns an HTTP response indicating the success or failure of the login attempt.
 */
export const POST = async (request) => {
    console.debug('Starting login process');

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
                {
                    success: false,
                    status: httpStatus.BAD_REQUEST,
                    message:
                        'Invalid model name. Only alphabets are allowed without any spaces, hyphens, or special characters.',
                    data: {},
                },
                {
                    'Content-Type': contentTypeConstants.JSON,
                }
            );
        }

        const UsersModel =
            (await models.prepareModelName) ||
            model(prepareModelName, usersSchema);

        console.debug('Starting user authentication process');
        const user = await UsersModel.findOne({
            'emails.email': userData.email,
        }).lean();
        if (!user) {
            return sendResponse(
                request,
                {
                    success: false,
                    status: httpStatus.NOT_FOUND,
                    message:
                        'No account found with that email address. Please check your email address or register for a new account.',
                    data: {},
                },
                {
                    'Content-Type': contentTypeConstants.JSON,
                }
            );
        }
        if (!user.isActive) {
            return sendResponse(
                request,
                {
                    success: false,
                    status: httpStatus.FORBIDDEN,
                    message:
                        'Your account is disabled, please contact support.',
                    data: {},
                },
                {
                    'Content-Type': contentTypeConstants.JSON,
                }
            );
        }

        const isEmailVerified = user.emails.find(
            (email) => email.isPrimaryEmail && email.isEmailVerified
        );
        if (!isEmailVerified) {
            return sendResponse(
                request,
                {
                    success: false,
                    status: httpStatus.FORBIDDEN,
                    message:
                        'Please verify your email address to proceed with logging in.',
                    data: {},
                },
                {
                    'Content-Type': contentTypeConstants.JSON,
                }
            );
        }

        if (!user.passwordHash || user.mustChangePassword) {
            return sendResponse(
                request,
                {
                    success: false,
                    status: httpStatus.FORBIDDEN,
                    message: user.mustChangePassword
                        ? 'Please change your password first.'
                        : 'Please set your password first.',
                    data: {},
                },
                {
                    'Content-Type': contentTypeConstants.JSON,
                }
            );
        }

        const isPasswordValid = await comparePassword(
            userData.password,
            user.passwordHash
        );
        if (!isPasswordValid) {
            console.debug(
                `Password validation failed for user: ${userData.email}`
            );

            await UsersModel.updateOne(
                { _id: user._id },
                {
                    $push: { 'login.failed.device': { dateTime: new Date() } },
                }
            );

            return sendResponse(
                request,
                {
                    success: false,
                    status: httpStatus.FORBIDDEN,
                    message:
                        'Incorrect password. Please try again or use the forgot password option to reset it.',
                    data: {},
                },
                {
                    'Content-Type': contentTypeConstants.JSON,
                }
            );
        }

        console.debug(
            `User authenticated successfully for email: ${userData.email}`
        );

        console.debug('Creating authentication token');
        const { token } = await createAuthenticationToken(
            user,
            {},
            user.designation
        );

        console.debug('Updating user login success data');
        await UsersModel.updateOne(
            { _id: user._id },
            {
                $push: { 'login.successful.device': { dateTime: new Date() } },
            }
        );

        const emailContent = prepareEmailContent('Login Successfully', {
            userName: user.name.first,
        });

        const primaryEmailObj = user.emails.find(
            (email) => email.isPrimaryEmail && email.isEmailVerified
        );
        const primaryEmail = primaryEmailObj.email;

        console.debug('Connecting to email service');
        await EmailService.connect();

        console.debug(`Sending login success email to: ${primaryEmail}`);
        await EmailService.sendEmail(
            primaryEmail,
            'Login Successfully',
            prepareEmail(emailContent)
        );

        return sendResponse(
            request,
            {
                success: true,
                status: httpStatus.OK,
                message: 'User logged in successfully.',
                data: { ...user, token },
            },
            {
                'Content-Type': contentTypeConstants.JSON,
            }
        );
    } catch (error) {
        console.debug('Connecting to database service');
        await databaseService.connect();

        console.debug('Incrementing authentication module usage despite error');
        await incrementUse();

        return sendResponse(
            request,
            {
                success: false,
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message:
                    configuration.env !== environment.PRODUCTION
                        ? error.message
                        : 'Internal Server Error.',
                data: {},
            },
            {
                'Content-Type': contentTypeConstants.JSON,
            }
        );
    }
};
