import Redis from 'ioredis';

import databaseService from '@/service/database.service';
import configuration from '@/configuration/configuration';
import httpStatus from '@/constants/httpStatus.constants';

import sendErrorResponse from '@/utilities/sendErrorResponse';
import incrementUse from '@/utilities/incrementUse';
import sendResponse from '@/utilities/sendResponse';

const redis = new Redis(configuration.redis.url);

export const GET = async (request, context) => {
    try {
        const { params } = context;
        const domain = params.domain;
        console.debug(`Checking existence for domain: ${domain}`);

        // Check if the domain exists in the 'blockedDomains' set
        const exists = await redis.sismember('blockedDomains', domain);
        console.debug(`Domain existence check, Result: ${exists}`);

        // Respond based on the existence of the domain
        if (exists === 1) {
            return sendResponse(
                request,
                true,
                httpStatus.OK,
                'Domain exists in the blocked list.',
                { exists: true }
            );
        } else {
            return sendResponse(
                request,
                true,
                httpStatus.OK,
                'Domain does not exist in the blocked list.',
                { exists: false }
            );
        }
    } catch (error) {
        console.debug('Connecting to database service');
        await databaseService.connect();

        console.debug('Incrementing authentication module usage despite error');
        await incrementUse();

        return sendErrorResponse(request, error);
    }
};

export const DELETE = async (request, context) => {
    try {
        const { params } = context;
        const domain = params.domain;
        console.debug(`Attempting to delete domain: ${domain}`);

        // Attempt to remove the domain from the 'blockedDomains' set
        const removed = await redis.srem('blockedDomains', domain);
        console.debug(`Domain removal attempt, Result: ${removed}`);

        // Respond based on the result of the removal
        if (removed === 1) {
            return sendResponse(
                request,
                true,
                httpStatus.OK,
                'Domain successfully removed from the blocked list.'
            );
        } else {
            return sendResponse(
                request,
                true,
                httpStatus.NOT_FOUND,
                'Domain not found in the blocked list or already removed.'
            );
        }
    } catch (error) {
        console.debug(
            'Error removing domain from Redis or connecting to database',
            error
        );
        await databaseService.connect();

        console.debug('Incrementing authentication module usage despite error');
        await incrementUse();

        return sendErrorResponse(
            request,
            error,
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to delete domain from the blocked list.'
        );
    }
};
