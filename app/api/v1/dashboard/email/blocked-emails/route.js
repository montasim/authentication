import Redis from 'ioredis';

import configuration from '@/configuration/configuration';
import databaseService from '@/service/database.service';
import httpStatus from '@/constants/httpStatus.constants';

import incrementUse from '@/utilities/incrementUse';
import sendResponse from '@/utilities/sendResponse';
import sendErrorResponse from '@/utilities/sendErrorResponse';

const redis = new Redis(configuration.redis.url);

export const POST = async (request) => {
    try {
        // Parse the JSON body from the request
        const { domain } = await request.json();
        console.debug(`Received domain data: ${domain}`);

        // Adding the domain to the Redis set 'blockedDomains'
        const result = await redis.sadd('blockedDomains', domain);
        console.debug(`Domain added to Redis, Result: ${result}`);

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Blocked domains added successfully.',
            result
        );
    } catch (error) {
        console.debug('Error loading domains or connecting to Redis', error);
        await databaseService.connect();

        console.debug('Incrementing module usage despite error');
        await incrementUse();

        return sendErrorResponse(request, error);
    }
};

export const GET = async (request, response) => {
    try {
        // Fetch all domains from the Redis set 'blockedDomains'
        const domains = await redis.smembers('blockedDomains');
        console.debug(`Fetched domains: ${JSON.stringify(domains)}`);

        // Return the list of domains with a successful response
        return sendResponse(
            request,
            response,
            httpStatus.OK,
            'Blocked domains retrieved successfully.',
            domains
        );
    } catch (error) {
        console.debug('Error retrieving domains from Redis', error);

        // In case of an error, send an appropriate error response
        return sendErrorResponse(
            request,
            response,
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to retrieve blocked domains',
            error.message
        );
    }
};

export const DELETE = async (request) => {
    try {
        // Delete the 'blockedDomains' set from Redis
        const result = await redis.del('blockedDomains');
        console.debug(`Blocked domains set deleted, Result: ${result}`);

        // Check if to delete was successful
        if (result === 1) {
            return sendResponse(
                request,
                true,
                httpStatus.OK,
                'All blocked domains have been successfully deleted.'
            );
        } else {
            return sendResponse(
                request,
                true,
                httpStatus.NOT_FOUND,
                'No blocked domains set to delete.'
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
