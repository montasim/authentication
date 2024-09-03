import mongoose, { model, models } from 'mongoose';
import UsersSchema from '@/app/api/v1/(users)/users.schema';
import databaseService from '@/service/database.service';
import httpStatus from '@/constants/httpStatus.constants.js';

import sendResponse from '@/utilities/sendResponse.js';
import sendErrorResponse from '@/utilities/sendErrorResponse';

// Function to dynamically fetch model names from MongoDB
async function getModelNames() {
    await databaseService.connect();
    const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
    return collections.map((collection) => collection.name);
}

// Function to fetch all documents from a specific model
async function fetchAllDocumentsFromModel(modelName) {
    const dynamicModel =
        models.modelName || model(modelName, UsersSchema, modelName); // Ensures no recompilation if the model already exists
    return dynamicModel.find().lean(); // Use lean for performance if only JSON data is needed
}

export async function GET(request) {
    try {
        console.debug('Fetching model names and their data');
        const modelNames = await getModelNames();
        const dataFetchPromises = modelNames.map((modelName) =>
            fetchAllDocumentsFromModel(modelName)
        );
        const results = await Promise.all(dataFetchPromises);
        const users = results.flat(); // Combine all users into a single array

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Users fetched successfully from all models.',
            users
        );
    } catch (error) {
        console.error('Error during operation:', error);
        return sendErrorResponse(request, error);
    }
}
