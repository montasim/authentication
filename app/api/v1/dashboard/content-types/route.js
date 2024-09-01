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
        'contentTypes.json',
        'contentTypes',
        'content types'
    );
};

export const GET = async (request) => {
    console.debug('Starting process to retrieve content types');

    try {
        const data = await redis.get('contentTypes');
        if (!data) {
            console.error('No content types data found in Redis.');
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'No data found',
                {}
            );
        }

        const contentTypes = JSON.parse(data);
        console.debug('Successfully retrieved content types from Redis.');
        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Content types retrieved successfully',
            contentTypes
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

export const DELETE = async (request) => {
    console.debug('Starting process to delete content types');

    try {
        const data = await redis.get('contentTypes');
        if (!data) {
            console.error('No content types data found in Redis.');
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'No data found to delete',
                {}
            );
        }

        // Remove the 'contentTypes' key from Redis, effectively deleting all content types
        await redis.del('contentTypes');
        console.debug('Deleted all content types from Redis.');

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'All content types deleted successfully'
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};
