import Redis from 'ioredis';

import service from '@/shared/service';
import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import sendErrorResponse from '@/utilities/sendErrorResponse';

const redis = new Redis(configuration.redis.url);

export const GET = async (request, context) => {
    return service.getValueByIdFromRedis(
        request,
        context,
        'activityTypes',
        'activity types'
    );
};

export const PUT = async (request, context) => {
    console.debug('Starting process to update a specific activity type');

    try {
        const { params } = context;
        const id = params.id;
        console.debug(`Updating activity type with ID: ${id}`);

        const { value, name, description } = await request.json();

        const existingData = await redis.get('activityTypes');
        const activityTypes = existingData ? JSON.parse(existingData) : [];

        console.debug(
            `Fetched ${activityTypes.length} activity types from Redis`
        );

        const index = activityTypes.findIndex((type) => type.id === id);
        if (index === -1) {
            console.warn(`Activity type not found for ID: ${id}`);
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'Activity type not found'
            );
        }

        if (name !== undefined) activityTypes[index].name = name;
        if (value !== undefined) activityTypes[index].value = value;
        if (description !== undefined)
            activityTypes[index].description = description;

        await redis.set('activityTypes', JSON.stringify(activityTypes));
        console.debug(`Activity type updated successfully in Redis: ${id}`);

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Activity type updated successfully',
            activityTypes[index]
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

export const DELETE = async (request, context) => {
    console.debug('Starting process to delete a specific activity type');

    try {
        const { params } = context;
        const id = params.id;
        console.debug(`Deleting activity type with ID: ${id}`);

        const existingData = await redis.get('activityTypes');
        let activityTypes = existingData ? JSON.parse(existingData) : [];
        const originalCount = activityTypes.length;

        activityTypes = activityTypes.filter((type) => type.id !== id);

        await redis.set('activityTypes', JSON.stringify(activityTypes));
        console.debug(
            `Deleted activity type from Redis: ${id}, affected count: ${originalCount - activityTypes.length}`
        );

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Activity type deleted successfully',
            activityTypes
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};
