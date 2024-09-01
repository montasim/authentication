import Redis from 'ioredis';

import service from '@/shared/service';
import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import sendErrorResponse from '@/utilities/sendErrorResponse';

const redis = new Redis(configuration.redis.url);

export const POST = async (request) => {
    return service.createOrUpdateDefaults(
        request,
        'activityTypes.json',
        'activityTypes',
        'activity types'
    );
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
