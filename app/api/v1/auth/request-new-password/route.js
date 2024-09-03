import { model, models } from 'mongoose';

import usersSchema from '@/app/api/v1/(users)/users.schema.js';
import databaseService from '@/service/database.service.js';
import httpStatus from '@/constants/httpStatus.constants.js';
import configuration from '@/configuration/configuration.js';
import EmailService from '@/service/email.service.js';

import sendResponse from '@/utilities/sendResponse.js';
import generateVerificationToken from '@/utilities/generateVerificationToken.js';
import prepareEmailContent from '@/shared/prepareEmailContent.js';
import prepareEmail from '@/shared/prepareEmail.js';
import getModelName from '@/utilities/getModelName';
import incrementUse from '@/utilities/incrementUse';
import sendErrorResponse from '@/utilities/sendErrorResponse';
import getEnvironmentByName from '@/utilities/getEnvironmentByName';

/**
 * Handles the password reset request process by generating a verification token and sending a password reset email.
 *
 * @async
 * @function PUT
 * @param {Request} request - The incoming request object, containing the user's email and site information.
 * @returns {Promise<Response>} - A Promise that resolves to an HTTP response, indicating the outcome of the password reset request process.
 *
 * @throws {Error} - If an error occurs during the password reset request process, an appropriate error message is logged, and a response with the relevant status code is returned.
 *
 * @description
 * This function performs the following steps:
 * 1. Connects to the database service.
 * 2. Increments the usage count of the authentication module.
 * 3. Extracts and validates the user data from the request body.
 * 4. Determines the correct model name based on the `siteName` from the user data.
 * 5. Finds the user by email and verifies the email is confirmed.
 * 6. Generates a reset password verification token and updates the user's document with this token.
 * 7. Constructs a password reset email link and prepares the email content.
 * 8. Sends a password reset email to the user's primary email address.
 * 9. Returns an HTTP response indicating the success or failure of the password reset request.
 */
export const PUT = async (request) => {
    console.debug('Starting password reset password request process');

    try {
        console.debug('Connecting to database service');
        await databaseService.connect();

        console.debug('Incrementing authentication module usage');
        await incrementUse();

        const userData = await request.json();
        console.debug(`Received user data: ${JSON.stringify(userData)}`);

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

        // Find the user by email and ensure the email is verified
        console.debug(
            `Looking up user with email: ${userData.email.toLowerCase()}`
        );
        const user = await UsersModel.findOne({
            'emails.email': userData.email.toLowerCase(),
            'emails.isEmailVerified': true,
        }).lean();
        if (!user) {
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'No account found with that email address, or the email address has not been verified. Please check your email address or register for a new account.'
            );
        }

        const primaryEmail = user.emails.find((e) => e.isPrimaryEmail);
        if (!primaryEmail) {
            return sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'No primary email found. Please contact support.'
            );
        }

        console.debug('Generating verification token');
        const { emailVerifyToken, emailVerifyTokenExpires, plainToken } =
            await generateVerificationToken();
        console.debug('Generated verification token and expiration date');

        console.debug('Updating user document with reset password token');
        await UsersModel.updateOne(
            { _id: user._id, 'emails.email': primaryEmail.email },
            {
                resetPasswordVerifyToken: emailVerifyToken,
                resetPasswordVerifyTokenExpires: emailVerifyTokenExpires,
            }
        );

        console.debug('User document updated successfully with reset token');

        console.debug('Constructing email verification link');
        const hostname = request.nextUrl.hostname;
        const emailVerificationLink =
            configuration.env === getEnvironmentByName('PRODUCTION')
                ? `https://${hostname}/api/v1/auth/reset-password/${plainToken}`
                : `http://${hostname}:3000/api/v1/auth/reset-password/${plainToken}`;

        console.debug(
            'Email verification link constructed:',
            emailVerificationLink
        );

        console.debug('Preparing email content for password reset');
        const emailContent = prepareEmailContent('Reset Your Password', {
            link: emailVerificationLink,
        });

        console.debug('Connecting to email service');
        await EmailService.connect();

        console.debug('Sending password reset email');
        await EmailService.sendEmail(
            primaryEmail.email,
            'Reset Your Password',
            prepareEmail(emailContent)
        );

        console.debug('Password reset email sent successfully');

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Password reset email sent successfully.'
        );
    } catch (error) {
        console.debug('Connecting to database service');
        await databaseService.connect();

        console.debug('Incrementing authentication module usage despite error');
        await incrementUse();

        return sendErrorResponse(request, error);
    }
};
