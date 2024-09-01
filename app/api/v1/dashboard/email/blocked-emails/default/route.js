import Redis from 'ioredis';
import fs from 'fs/promises';
import path from 'path';

import configuration from '@/configuration/configuration';
import databaseService from '@/service/database.service';
import httpStatus from '@/constants/httpStatus.constants';

import incrementUse from '@/utilities/incrementUse';
import sendResponse from '@/utilities/sendResponse';
import sendErrorResponse from '@/utilities/sendErrorResponse';

const redis = new Redis(configuration.redis.url);

export const POST = async (request) => {
    try {
        const filePath = path.resolve('vendor/', 'blockedEmailDomains.txt');
        const data = await fs.readFile(filePath, 'utf8');
        const domains = data
            .split(/\r?\n/)
            .filter((line) => line.trim() !== '');
        if (domains.length > 0) {
            // Using the correct method name `sadd`
            await redis.sadd('blockedDomains', domains);
            console.log('Domains loaded into Redis');
        }

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Domains loaded successfully.',
            domains
        );
    } catch (error) {
        console.debug('Error loading domains or connecting to Redis', error);
        await databaseService.connect();

        console.debug('Incrementing module usage despite error');
        await incrementUse();

        return sendErrorResponse(request, error);
    }
};
