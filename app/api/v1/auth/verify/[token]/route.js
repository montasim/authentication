import { model, models } from 'mongoose';

import usersSchema from '@/app/api/v1/(users)/users.model.js';
import databaseService from '@/service/database.service.js';
import httpStatus from '@/constants/httpStatus.constants.js';
import EmailService from '@/service/email.service.js';
import contentTypeConstants from '@/constants/contentType.constants';

import sendResponse from '@/utilities/sendResponse.js';
import prepareEmailContent from '@/shared/prepareEmailContent.js';
import prepareEmail from '@/shared/prepareEmail.js';
import generateHashedToken from '@/utilities/generateHashedToken.js';
import getModelName from '@/utilities/getModelName';
import incrementUse from '@/utilities/incrementUse';
import configuration from '@/configuration/configuration';
import environment from '@/constants/environment.constants';

/**
 * Handles the user email verification process by validating the provided verification token, updating the user's email verification status, and sending a welcome email.
 *
 * @async
 * @function POST
 * @param {Request} request - The incoming request object, containing the verification token.
 * @param {Object} context - The context object containing additional parameters such as the verification token.
 * @returns {Promise<Response>} - A Promise that resolves to an HTTP response, indicating the outcome of the email verification process.
 *
 * @throws {Error} - If an error occurs during the email verification process, an appropriate error message is logged, and a response with the relevant status code is returned.
 *
 * @description
 * This function performs the following steps:
 * 1. Connects to the database service.
 * 2. Increments the usage count of the authentication module.
 * 3. Extracts the verification token from the request parameters.
 * 4. Hashes the token and searches for a user with a matching token in the database.
 * 5. Validates the token by checking if it is associated with an email that is not already verified and that the token has not expired.
 * 6. Updates the user's document to mark the email as verified and removes the token fields.
 * 7. Sends a welcome email to the verified email address.
 * 8. Returns an HTTP response indicating the success or failure of the email verification process.
 */
export async function POST(request, context) {
    console.debug('Starting user verification process');

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

        const { params } = context;
        const token = params.token;
        console.debug('Received verification token from request parameters');

        // Hash the plain token to compare with the stored hash
        const hashedToken = await generateHashedToken(token);

        console.debug('Looking up user by hashed token');
        const user = await UsersModel.findOne({
            'emails.emailVerifyToken': hashedToken,
        });
        if (!user) {
            const response = {
                success: false,
                status: httpStatus.NOT_FOUND,
                message: 'The verification link is invalid.',
                data: {},
            };

            // Return an error response
            return sendResponse(request, response, {
                'Content-Type': contentTypeConstants.JSON,
            });
        }

        // Find the specific email record that matches the hashed token
        const emailDetails = user.emails.find(
            (email) => email.emailVerifyToken === hashedToken
        );
        if (!emailDetails) {
            const response = {
                success: false,
                status: httpStatus.FORBIDDEN,
                message:
                    'The verification link is invalid. Please request a new verification email.',
                data: {},
            };

            // Return an error response
            return sendResponse(request, response, {
                'Content-Type': contentTypeConstants.JSON,
            });
        }

        // Check if the email has already been verified or if the token has expired
        if (emailDetails.isEmailVerified) {
            const response = {
                success: false,
                status: httpStatus.BAD_REQUEST,
                message:
                    'This email has already been verified. No further action is required.',
                data: {},
            };

            // Return an error response
            return sendResponse(request, response, {
                'Content-Type': contentTypeConstants.JSON,
            });
        } else if (emailDetails.emailVerifyTokenExpires < Date.now()) {
            const response = {
                success: false,
                status: httpStatus.FORBIDDEN,
                message:
                    'The verification link has expired. Please request a new verification email.',
                data: {},
            };

            // Return an error response
            return sendResponse(request, response, {
                'Content-Type': contentTypeConstants.JSON,
            });
        }

        console.debug('Verification checks passed, updating user document');
        const updateResult = await UsersModel.updateOne(
            { _id: user._id, 'emails.emailVerifyToken': hashedToken },
            {
                $set: {
                    'emails.$.isEmailVerified': true,
                    'emails.$.emailVerifyToken': undefined,
                    'emails.$.emailVerifyTokenExpires': undefined,
                },
            }
        );

        if (updateResult.modifiedCount !== 1) {
            const response = {
                success: false,
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to verify the email. Please try again.',
                data: {},
            };

            // Return an error response
            return sendResponse(request, response, {
                'Content-Type': contentTypeConstants.JSON,
            });
        }

        console.debug(
            'User document updated successfully, sending welcome email'
        );
        const subject = 'Welcome Email';
        const emailData = {
            userName: user.name.first,
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

        console.debug(`Sending welcome email to ${emailDetails.email}`);
        await EmailService.sendEmail(
            emailDetails.email,
            subject,
            prepareEmail(
                pageTitle,
                preheaderText,
                heroSection,
                mainSection,
                footerContent
            )
        );

        // Create response
        const response = {
            success: false,
            status: httpStatus.OK,
            message: 'Email has been successfully verified.',
            data: {},
        };

        // Return an error response
        return sendResponse(request, response, {
            'Content-Type': contentTypeConstants.JSON,
        });
    } catch (error) {
        console.debug('Connecting to database service');
        await databaseService.connect();

        console.debug('Incrementing authentication module usage despite error');
        await incrementUse();

        return sendResponse(
            request,
            false,
            httpStatus.INTERNAL_SERVER_ERROR,
            configuration.env !== environment.PRODUCTION
                ? error.message
                : 'Internal Server Error.'
        );
    }
}
