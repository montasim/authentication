import { model, models } from 'mongoose';
import axios from 'axios';

import usersSchema from '@/app/api/v1/(users)/users.schema.js';
import databaseService from '@/service/database.service.js';
import httpStatus from '@/constants/httpStatus.constants.js';
import configuration from '@/configuration/configuration.js';
import serverApiCall from '@/utilities/axios.server';

import sendResponse from '@/utilities/sendResponse.js';
import generateVerificationToken from '@/utilities/generateVerificationToken.js';
import getModelName from '@/utilities/getModelName';
import sendErrorResponse from '@/utilities/sendErrorResponse';
import getDataByCriteria from '@/utilities/getDataByCriteria';

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

        const userData = await request.json();
        console.debug(`Received user data: ${JSON.stringify(userData)}`);

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

        // Find the user by email and ensure the email is verified
        console.debug(
            `Looking up user with email: ${userData.email.toLowerCase()}`
        );
        const user = await UsersModel.findOne({
            'emails.email': userData.email.toLowerCase(),
            'emails.isEmailVerified': true,
        }).lean();
        if (!user) {
            return await sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'No account found with that email address, or the email address has not been verified. Please check your email address or register for a new account.'
            );
        }

        const primaryEmail = user.emails.find((e) => e.isPrimaryEmail);
        if (!primaryEmail) {
            return await sendResponse(
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
                ? `https://${hostname}/auth/verify/${plainToken}?t=rp`
                : `http://${hostname}:3000/auth/verify/${plainToken}`;

        console.debug(
            'Email verification link constructed:',
            emailVerificationLink
        );

        console.debug('Sending password reset email');
        axios.post(`${configuration.service.sendEmail}/api/v1/send-email`, {
            email: primaryEmail.email,
            subject: 'Reset Your Password',
            userName: user?.name?.first,
            emailVerificationLink,
            deviceType: 'IOS',
            loginTime: new Date().toISOString(),
            ipAddress: '1:1:1:1',
        });

        console.debug('Password reset email sent successfully');

        return await sendResponse(
            request,
            true,
            httpStatus.OK,
            'Password reset email sent successfully.'
        );
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
};
