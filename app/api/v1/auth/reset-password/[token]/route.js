import { model, models } from 'mongoose';
import axios from 'axios';

import usersSchema from '@/app/api/v1/(users)/users.schema.js';
import databaseService from '@/service/database.service.js';
import httpStatus from '@/constants/httpStatus.constants.js';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse.js';
import generateHashedToken from '@/utilities/generateHashedToken.js';
import validatePassword from '@/utilities/validatePassword.js';
import createHashedPassword from '@/utilities/createHashedPassword.js';
import comparePassword from '@/utilities/comparePassword.js';
import getModelName from '@/utilities/getModelName';
import sendErrorResponse from '@/utilities/sendErrorResponse';

const sendResetConfirmationEmail = async (user) => {
    console.debug(
        `Sending reset confirmation email to ${user.emails.find((email) => email.isPrimaryEmail).email}`
    );
    await axios.post(`${configuration.service.sendEmail}/api/v1/send-email`, {
        email: user.emails.find((email) => email.isPrimaryEmail).email,
        subject: 'Reset Password Successful',
        userName: user?.name?.first,
        deviceType: 'IOS',
        loginTime: new Date().toISOString(),
        ipAddress: '1:1:1:1',
    });
};

/**
 * Handles the password reset process by validating the provided token and old password, updating the user's password, and sending a confirmation email.
 *
 * @async
 * @function PUT
 * @param {Request} request - The incoming request object, containing the token and new password details.
 * @param {Object} context - The context object containing additional parameters such as the reset token.
 * @returns {Promise<Response>} - A Promise that resolves to an HTTP response, indicating the outcome of the password reset process.
 *
 * @throws {Error} - If an error occurs during the password reset process, an appropriate error message is logged, and a response with the relevant status code is returned.
 *
 * @description
 * This function performs the following steps:
 * 1. Connects to the database service.
 * 2. Increments the usage count of the authentication module.
 * 3. Extracts and validates the user data from the request body.
 * 4. Determines the correct model name based on the `siteName` from the user data.
 * 5. Finds the user by the provided reset token and checks if the token is valid and not expired.
 * 6. Validates the old password and ensures the new passwords match and meet the required strength.
 * 7. Hashes the new password and updates the user's document, clearing the reset token fields.
 * 8. Sends a reset confirmation email to the user's primary email address.
 * 9. Returns an HTTP response indicating the success or failure of the password reset process.
 */
export const PUT = async (request, context) => {
    console.debug('Starting password reset password process');

    try {
        console.debug('Connecting to database service');
        await databaseService.connect();

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

        const { params } = context;
        const token = params.token;
        const hashedToken = await generateHashedToken(token);

        console.debug(
            `Looking up user with reset token ending in ${hashedToken.slice(-4)}`
        );
        const user = await UsersModel.findOne({
            resetPasswordVerifyToken: hashedToken,
            resetPasswordVerifyTokenExpires: { $gt: Date.now() },
        });

        if (!user) {
            return await sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'Your password reset link is invalid or has expired. Please request a new password reset link.'
            );
        }

        if (!user.emails.find((email) => email.isPrimaryEmail)) {
            return await sendResponse(
                request,
                false,
                httpStatus.UNPROCESSABLE_ENTITY,
                'No primary email found. Please contact support.'
            );
        }

        console.debug('Validating old password');

        const isPasswordValid = await comparePassword(
            userData.oldPassword,
            user.passwordHash
        );
        if (!isPasswordValid) {
            return await sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'The old password you entered is incorrect. Please try again.'
            );
        }

        console.debug('Validating new passwords for match and strength');
        if (userData.newPassword !== userData.confirmNewPassword) {
            return await sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                'The new passwords do not match. Please ensure both passwords are the same and try again.'
            );
        }

        const passwordValidationResult = await validatePassword(
            userData.newPassword
        );
        if (passwordValidationResult !== 'Valid') {
            return await sendResponse(
                request,
                false,
                httpStatus.BAD_REQUEST,
                `New password validation failed: ${passwordValidationResult}`
            );
        }

        console.debug(`Hashing new password for user ${user._id}`);
        user.passwordHash = await createHashedPassword(userData.newPassword);
        user.resetPasswordVerifyToken = undefined;
        user.resetPasswordVerifyTokenExpires = undefined;

        console.debug(`Updating user ${user._id} with new password`);
        await user.save();
        await sendResetConfirmationEmail(user);

        return await sendResponse(
            request,
            true,
            httpStatus.OK,
            'Your password has been reset successfully.'
        );
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
};
