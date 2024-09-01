import fs from 'fs/promises';
import path from 'path';
import Redis from 'ioredis';

import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import sendErrorResponse from '@/utilities/sendErrorResponse';
import toSentenceCase from '@/utilities/toSentenceCase';

const redis = new Redis(configuration.redis.url);

const createOrUpdateDefaults = async (
    request,
    fileName,
    redisKey,
    entityName
) => {
    console.debug(`Starting ${entityName} update process`);

    try {
        const filePath = path.resolve('constants/', fileName);
        console.debug(`Reading ${entityName} from file: ${filePath}`);
        const fileData = await fs.readFile(filePath, 'utf8');
        const newEntities = JSON.parse(fileData);
        console.debug(`Successfully read ${entityName} from file`);

        console.debug(`Fetching existing ${entityName} from Redis`);
        const existingData = await redis.get(redisKey);
        const entities = existingData ? JSON.parse(existingData) : [];
        console.debug(`Fetched ${entities.length} ${entityName} from Redis`);

        console.debug(`Merging new ${entityName} with existing ones`);
        newEntities?.forEach((newEntity) => {
            const index = entities?.findIndex(
                (entity) => entity.id === newEntity.id
            );
            if (index > -1) {
                console.debug(
                    `Updating existing ${entityName.slice(0, -1)} with ID: ${newEntity.id}`
                );
                entities[index] = { ...entities[index], ...newEntity };
            } else {
                console.debug(
                    `Adding new ${entityName.slice(0, -1)} with ID: ${newEntity.id}`
                );
                entities.push(newEntity);
            }
        });

        console.debug(`Saving updated ${entityName} back to Redis`);
        await redis.set(redisKey, JSON.stringify(entities));
        console.debug(`Successfully updated ${entityName} in Redis.`);

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            `${toSentenceCase(entityName)} values reset successfully.`,
            entities
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const service = {
    createOrUpdateDefaults,
};

export default service;
