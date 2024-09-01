import Redis from 'ioredis';
import fs from 'fs/promises';
import path from 'path';

import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import getEnvironmentByName from '@/utilities/getEnvironmentByName';

const redis = new Redis(configuration.redis.url);

export const POST = async (request) => {
    try {
        const filePath = path.resolve('constants/', 'activityTypes.json');
        const fileData = await fs.readFile(filePath, 'utf8');
        const newActivityTypes = JSON.parse(fileData);

        const existingData = await redis.get('activityTypes');
        const activityTypes = existingData ? JSON.parse(existingData) : [];

        newActivityTypes?.forEach((newType) => {
            const index = activityTypes?.findIndex(
                (type) => type.id === newType.id
            );
            if (index > -1) {
                activityTypes[index] = { ...activityTypes[index], ...newType };
            } else {
                activityTypes.push(newType);
            }
        });

        await redis.set('activityTypes', JSON.stringify(activityTypes));
        console.debug('Updated activity types in Redis.');

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Activity types updated successfully',
            activityTypes
        );
    } catch (error) {
        return sendResponse(
            request,
            false,
            httpStatus.INTERNAL_SERVER_ERROR,
            configuration.env !== getEnvironmentByName('PRODUCTION')
                ? error.message
                : 'Internal Server Error.'
        );
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
        return sendResponse(
            request,
            false,
            httpStatus.INTERNAL_SERVER_ERROR,
            configuration.env !== getEnvironmentByName('PRODUCTION')
                ? error.message
                : 'Internal Server Error.'
        );
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
        return sendResponse(
            request,
            false,
            httpStatus.INTERNAL_SERVER_ERROR,
            configuration.env !== getEnvironmentByName('PRODUCTION')
                ? error.message
                : 'Internal Server Error.'
        );
    }
};
