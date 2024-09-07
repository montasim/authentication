import { model, models } from 'mongoose';

import usersSchema from '@/app/api/v1/(users)/users.schema';
import databaseService from '@/service/database.service';
import httpStatus from '@/constants/httpStatus.constants.js';

import sendResponse from '@/utilities/sendResponse.js';
import sendErrorResponse from '@/utilities/sendErrorResponse';
import getModelName from '@/utilities/getModelName';

export async function GET(request) {
    console.debug('Fetching users details from collection');

    try {
        const url = new URL(request?.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());

        console.debug('Query Parameters:', queryParams);
        console.debug(
            `Retrieving user with ID: ${queryParams?.id} - ${queryParams?.siteName}`
        );

        console.debug('Connecting to database service');
        await databaseService.connect();

        const prepareModelName = getModelName(queryParams?.siteName);
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

        const user = await UsersModel.findById(queryParams?.id).lean();
        if (!user) {
            return await sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'No user found with the provided ID.'
            );
        }

        return await sendResponse(
            request,
            true,
            httpStatus.OK,
            'User details fetched successfully.',
            user
        );
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
}
