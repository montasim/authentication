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
        'contentTypes',
        'content types'
    );
};

export const PUT = async (request, context) => {
    console.debug('Starting process to update a specific content type');

    try {
        const { params } = context;
        const id = params.id;
        console.debug(`Updating content type with ID: ${id}`);

        const { value, name, description } = await request.json();

        const existingData = await redis.get('contentTypes');
        const contentTypes = existingData ? JSON.parse(existingData) : [];

        console.debug(
            `Fetched ${contentTypes.length} content types from Redis`
        );

        const index = contentTypes.findIndex((type) => type.id === id);
        if (index === -1) {
            console.warn(`Content type not found for ID: ${id}`);
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'Content type not found'
            );
        }

        if (name !== undefined) contentTypes[index].name = name;
        if (value !== undefined) contentTypes[index].value = value;
        if (description !== undefined)
            contentTypes[index].description = description;

        await redis.set('contentTypes', JSON.stringify(contentTypes));
        console.debug(`Content type updated successfully in Redis: ${id}`);

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Content type updated successfully',
            contentTypes[index]
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

export const DELETE = async (request, context) => {
    console.debug('Starting process to delete a specific content type');

    try {
        const { params } = context;
        const id = params.id;
        console.debug(`Deleting content type with ID: ${id}`);

        const existingData = await redis.get('contentTypes');
        let contentTypes = existingData ? JSON.parse(existingData) : [];
        const originalCount = contentTypes.length;

        contentTypes = contentTypes.filter((type) => type.id !== id);

        await redis.set('contentTypes', JSON.stringify(contentTypes));
        console.debug(
            `Deleted content type from Redis: ${id}, affected count: ${originalCount - contentTypes.length}`
        );

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Content type deleted successfully',
            contentTypes
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};
