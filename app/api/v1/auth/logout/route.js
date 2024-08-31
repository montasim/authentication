import databaseService from '@/service/database.service';
import httpStatus from '@/constants/httpStatus.constants.js';
import configuration from '@/configuration/configuration.js';
import environment from '@/constants/environment.constants.js';
import contentTypeConstants from '@/constants/contentType.constants';

import sendResponse from '@/utilities/sendResponse.js';
import incrementUse from '@/utilities/incrementUse';

/**
 * Handles user logout requests by invalidating the authentication token and removing session information.
 *
 * @async
 * @function GET
 * @param {Request} request - The incoming request object, containing the JWT token in the authorization header.
 * @returns {Promise<Response>} - A Promise that resolves to an HTTP response, indicating the outcome of the logout process.
 *
 * @throws {Error} - If an error occurs during the logout process, an appropriate error message is logged, and a response with the relevant status code is returned.
 *
 * @description
 * This function performs the following steps:
 * 1. Connects to the database service.
 * 2. Increments the usage count of the authentication module.
 * 3. Extracts the JWT token from the authorization header of the request.
 * 4. If the JWT token is not provided or invalid, returns an unauthorized response.
 * 5. Proceeds with the logout process by potentially validating the token, removing session cookies, and handling session invalidation (these steps are placeholders for further implementation).
 * 6. Returns an HTTP response indicating the success or failure of the logout attempt.
 */
export const GET = async (request) => {
    console.debug('Starting logout process');

    try {
        console.debug('Connecting to database service');
        await databaseService.connect();

        console.debug('Incrementing authentication module usage');
        await incrementUse();

        console.debug('Extracting authorization header');
        const authHeader = request?.headers.get('authorization');
        const jwtToken = authHeader?.startsWith('Bearer ')
            ? authHeader.substring(7)
            : null;
        if (!jwtToken) {
            return sendResponse(
                request,
                {
                    success: false,
                    status: httpStatus.UNAUTHORIZED,
                    message: 'No authentication token provided.',
                    data: {},
                },
                {
                    'Content-Type': contentTypeConstants.JSON,
                }
            );
        }

        console.debug('JWT token found, proceeding with logout process');

        // TODO: validate the token
        // TODO: remove session cookie
        // TODO: remove session device

        // Assuming you have a function to handle token invalidation
        // await invalidateToken(jwtToken);

        return sendResponse(
            request,
            {
                success: true,
                status: httpStatus.OK,
                message: 'You have been logged out successfully.',
                data: {},
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
            false,
            httpStatus.INTERNAL_SERVER_ERROR,
            configuration.env !== environment.PRODUCTION
                ? error.message
                : 'Internal Server Error.'
        );
    }
};
