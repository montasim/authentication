import Redis from 'ioredis';
import fs from 'fs/promises';
import path from 'path';

import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import sendErrorResponse from '@/utilities/sendErrorResponse';

const redis = new Redis(configuration.redis.url);

export const POST = async (request) => {
    console.debug('Starting activity types update process');

    try {
        const filePath = path.resolve('constants/', 'activityTypes.json');
        console.debug(`Reading activity types from file: ${filePath}`);
        const fileData = await fs.readFile(filePath, 'utf8');
        const newActivityTypes = JSON.parse(fileData);
        console.debug('Successfully read activity types from file');

        console.debug('Fetching existing activity types from Redis');
        const existingData = await redis.get('activityTypes');
        const activityTypes = existingData ? JSON.parse(existingData) : [];
        console.debug(
            `Fetched ${activityTypes.length} activity types from Redis`
        );

        console.debug('Merging new activity types with existing ones');
        newActivityTypes?.forEach((newType) => {
            const index = activityTypes?.findIndex(
                (type) => type.id === newType.id
            );
            if (index > -1) {
                console.debug(
                    `Updating existing activity type with ID: ${newType.id}`
                );
                activityTypes[index] = { ...activityTypes[index], ...newType };
            } else {
                console.debug(
                    `Adding new activity type with ID: ${newType.id}`
                );
                activityTypes.push(newType);
            }
        });

        console.debug('Saving updated activity types back to Redis');
        await redis.set('activityTypes', JSON.stringify(activityTypes));
        console.debug('Successfully updated activity types in Redis.');

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Activity types updated successfully',
            activityTypes
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

export const GET = async (request) => {
    console.debug('Starting process to retrieve activity types');

    try {
        const data = await redis.get('activityTypes');
        if (!data) {
            console.error('No activity types data found in Redis.');
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'No data found',
                {}
            );
        }

        const activityTypes = JSON.parse(data);
        console.debug('Successfully retrieved activity types from Redis.');
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
    console.debug('Starting process to delete activity types');

    try {
        const data = await redis.get('activityTypes');
        if (!data) {
            console.error('No activity types data found in Redis.');
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'No data found to delete',
                {}
            );
        }

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
