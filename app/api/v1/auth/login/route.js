import { model, models } from 'mongoose';
import axios from 'axios';

import usersSchema from '@/app/api/v1/(users)/users.schema';
import databaseService from '@/service/database.service.js';
import httpStatus from '@/constants/httpStatus.constants.js';
import configuration from '@/configuration/configuration';

import getModelName from '@/utilities/getModelName';
import sendResponse from '@/utilities/sendResponse.js';
import comparePassword from '@/utilities/comparePassword.js';
import createAuthenticationToken from '@/utilities/createAuthenticationToken.js';
import sendErrorResponse from '@/utilities/sendErrorResponse';

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

        console.debug('Starting user authentication process');
        const user = await UsersModel.findOne({
            'emails.email': userData.email,
        }).lean();
        if (!user) {
            return await sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'No account found with that email address. Please check your email address or register for a new account.'
            );
        }
        if (!user.isActive) {
            return await sendResponse(
                request,
                false,
                httpStatus.FORBIDDEN,
                'Your account is disabled, please contact support.'
            );
        }

        const isEmailVerified = user.emails.find(
            (email) => email.isPrimaryEmail && email.isEmailVerified
        );
        if (!isEmailVerified) {
            return await sendResponse(
                request,
                false,
                httpStatus.FORBIDDEN,
                'Please verify your email address to proceed with logging in.'
            );
        }

        if (!user.passwordHash || user.mustChangePassword) {
            return await sendResponse(
                request,
                false,
                httpStatus.FORBIDDEN,
                user.mustChangePassword
                    ? 'Please change your password first.'
                    : 'Please set your password first.'
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

            return await sendResponse(
                request,
                false,
                httpStatus.FORBIDDEN,
                'Incorrect password. Please try again or use the forgot password option to reset it.'
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

        const primaryEmailObj = user.emails.find(
            (email) => email.isPrimaryEmail && email.isEmailVerified
        );
        const primaryEmail = primaryEmailObj.email;

        axios.post(`${configuration.service.sendEmail}/api/v1/send-email`, {
            email: primaryEmail,
            subject: 'Login Successfully',
            userName: user?.name?.first,
            deviceType: 'IOS',
            loginTime: new Date().toISOString(),
            ipAddress: '1:1:1:1',
        });

        return await sendResponse(
            request,
            true,
            httpStatus.OK,
            'User logged in successfully.',
            { ...user, token }
        );
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
};
