import Redis from 'ioredis';
import fs from 'fs/promises';
import path from 'path';

import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import sendErrorResponse from '@/utilities/sendErrorResponse';

const redis = new Redis(configuration.redis.url);

export const POST = async (request) => {
    try {
        console.debug('Starting content types update process');

        const filePath = path.resolve('constants/', 'contentTypes.json');
        console.debug(`Reading content types from file: ${filePath}`);
        const fileData = await fs.readFile(filePath, 'utf8');
        const newContentTypes = JSON.parse(fileData);
        console.debug('Successfully read content types from file');

        console.debug('Fetching existing content types from Redis');
        const existingData = await redis.get('contentTypes');
        const contentTypes = existingData ? JSON.parse(existingData) : [];
        console.debug(
            `Fetched ${contentTypes.length} content types from Redis`
        );

        console.debug('Merging new content types with existing ones');
        newContentTypes?.forEach((newType) => {
            const index = contentTypes?.findIndex(
                (type) => type.id === newType.id
            );
            if (index > -1) {
                console.debug(
                    `Updating existing content type with ID: ${newType.id}`
                );
                contentTypes[index] = { ...contentTypes[index], ...newType };
            } else {
                console.debug(`Adding new content type with ID: ${newType.id}`);
                contentTypes.push(newType);
            }
        });

        console.debug('Saving updated content types back to Redis');
        await redis.set('contentTypes', JSON.stringify(contentTypes));
        console.debug('Successfully updated content types in Redis.');

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Content types updated successfully',
            contentTypes
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

export const GET = async (request, response) => {
    try {
        const data = await redis.get('activityTypes');
        if (!JSON.parse(data)) {
            console.error('Invalid JSON data in Redis.');
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'No data found',
                {}
            );
        }

        const activityTypes = JSON.parse(data);
        console.debug('Retrieved activity types from Redis.');
        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Activity types retrieved successfully',
            activityTypes
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

export const DELETE = async (request) => {
    try {
        // Remove the 'activityTypes' key from Redis, effectively deleting all activity types
        await redis.del('activityTypes');
        console.debug('Deleted all activity types from Redis.');

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'All activity types deleted successfully'
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};
