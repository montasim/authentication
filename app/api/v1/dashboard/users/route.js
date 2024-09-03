import mongoose from 'mongoose';

import databaseService from '@/service/database.service';
import httpStatus from '@/constants/httpStatus.constants.js';

import sendResponse from '@/utilities/sendResponse.js';
import sendErrorResponse from '@/utilities/sendErrorResponse';

// Function to fetch documents from all collections using MongoDB aggregation
async function fetchAllDocumentsFromAllCollections() {
    try {
        console.debug('Connecting to database service');
        await databaseService.connect();

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
        const documentsFromAllCollections =
            await fetchAllDocumentsFromAllCollections();

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Users fetched successfully from all collections.',
            documentsFromAllCollections
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
}
