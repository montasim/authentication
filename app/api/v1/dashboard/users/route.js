import mongoose, { model, models } from 'mongoose';

import usersSchema from '@/app/api/v1/(users)/users.schema';
import databaseService from '@/service/database.service';
import httpStatus from '@/constants/httpStatus.constants.js';

import sendResponse from '@/utilities/sendResponse.js';
import sendErrorResponse from '@/utilities/sendErrorResponse';
import getModelName from '@/utilities/getModelName';

// Function to fetch documents from all collections using MongoDB aggregation
async function fetchAllDocumentsFromAllCollections() {
    try {
        console.debug('Getting all collection names');
        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();
        const collectionNames = collections.map(
            (collection) => collection.name
        );

        console.debug('Fetching users from all collections');
        const results = await Promise.all(
            collectionNames.map(async (collectionName) => {
                const collection =
                    mongoose.connection.db.collection(collectionName);
                const documents = await collection
                    .aggregate([
                        // Here you can add any aggregation stages you need
                        // For example: {$match: {}}, {$sort: {createdAt: -1}}
                    ])
                    .toArray();
                return { site: collectionName, data: documents };
            })
        );

        return results;
    } catch (error) {
        console.error('Error fetching documents from all collections:', error);
        throw error;
    }
}

export async function GET(request) {
    console.debug('Fetching users from all collections');

    try {
        const url = new URL(request?.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());

        console.debug('Connecting to database service');
        await databaseService.connect();

        if (queryParams.id) {
            console.debug('Query Parameters:', queryParams);
            console.debug(
                `Retrieving user with ID: ${queryParams?.id} - ${queryParams?.siteName}`
            );

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
                'Users fetched successfully.',
                user
            );
        } else {
            const documentsFromAllCollections =
                await fetchAllDocumentsFromAllCollections();

            return await sendResponse(
                request,
                true,
                httpStatus.OK,
                'Users fetched successfully from all collections.',
                documentsFromAllCollections
            );
        }
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
}
