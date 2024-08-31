import UsesModel from '@/app/api/v1/uses/uses.model';
import databaseService from '@/service/database.service';
import httpStatus from '@/constants/httpStatus.constants.js';
import configuration from '@/configuration/configuration';
import environment from '@/constants/environment.constants';

import sendResponse from '@/utilities/sendResponse.js';

/**
 * Fetches and returns data from the UsesModel collection.
 *
 * @async
 * @function GET
 * @param {Request} request - The incoming request object.
 * @returns {Promise<Response>} - A Promise that resolves to an HTTP response containing the fetched data or an error message.
 *
 * @throws {Error} - If an error occurs during the data retrieval process, an appropriate error message is logged, and a response with the relevant status code is returned.
 *
 * @description
 * This function performs the following steps:
 * 1. Connects to the database service.
 * 2. Increments the usage count of the authentication module.
 * 3. Retrieves data from the UsesModel collection.
 * 4. Returns an HTTP response with the fetched data or an error response if the operation fails.
 */
export async function GET(request) {
    try {
        console.debug('Connecting to database service');
        await databaseService.connect();

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Uses fetched successfully.',
            await UsesModel.findOne()
        );
    } catch (error) {
        console.debug('Connecting to database service');
        await databaseService.connect();

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
