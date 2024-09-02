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

const getValuesFromRedis = async (request, redisKey, entityName) => {
    console.debug(`Starting process to retrieve ${entityName}`);

    try {
        const data = await redis.get(redisKey);
        if (!data) {
            console.error(`No ${entityName} data found in Redis.`);
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                `No ${entityName} data found`,
                {}
            );
        }

        const values = JSON.parse(data);
        console.debug(`Successfully retrieved ${entityName} from Redis.`);
        return sendResponse(
            request,
            true,
            httpStatus.OK,
            `${toSentenceCase(entityName)} retrieved successfully`,
            values
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const deleteValuesFromRedis = async (request, redisKey, entityName) => {
    console.debug(`Starting process to delete ${entityName}`);

    try {
        const data = await redis.get(redisKey);
        if (!data) {
            console.error(`No ${entityName} data found in Redis.`);
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                `No ${entityName} data found to delete`,
                {}
            );
        }

        // Remove the key from Redis, effectively deleting all data under that key
        await redis.del(redisKey);
        console.debug(`Deleted all ${entityName} from Redis.`);

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            `All ${entityName} deleted successfully`
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const getValueByIdFromRedis = async (
    request,
    context,
    redisKey,
    entityName
) => {
    console.debug(`Starting process to retrieve a specific ${entityName}`);

    try {
        const { params } = context;
        const id = params.id;
        console.debug(`Retrieving ${entityName.slice(0, -1)} with ID: ${id}`);

        const existingData = await redis.get(redisKey);
        const entities = existingData ? JSON.parse(existingData) : [];

        console.debug(`Fetched ${entities.length} ${entityName} from Redis`);

        const index = entities.findIndex((type) => type.id === id);
        let sentenceCase;
        if (index === -1) {
            sentenceCase = toSentenceCase(entityName.slice(0, -1));
            console.warn(`${sentenceCase} not found for ID: ${id}`);
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                `${toSentenceCase(entityName.slice(0, -1))} not found`
            );
        }

        sentenceCase = toSentenceCase(entityName.slice(0, -1));
        console.debug(
            `${sentenceCase} retrieved successfully from Redis: ${id}`
        );
        return sendResponse(
            request,
            true,
            httpStatus.OK,
            `${sentenceCase} retrieved successfully`,
            entities[index]
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const updateValueByIdInRedis = async (
    request,
    context,
    redisKey,
    entityName
) => {
    console.debug(
        `Starting process to update a specific ${entityName.slice(0, -1)}`
    );

    try {
        const { params } = context;
        const id = params.id;
        console.debug(`Updating ${entityName.slice(0, -1)} with ID: ${id}`);

        const { value, name, description } = await request.json();

        const existingData = await redis.get(redisKey);
        const entities = existingData ? JSON.parse(existingData) : [];

        console.debug(`Fetched ${entities.length} ${entityName} from Redis`);

        const index = entities.findIndex((entity) => entity.id === id);
        let sentenceCase;
        if (index === -1) {
            sentenceCase = toSentenceCase(entityName.slice(0, -1));
            console.warn(`${entityName.slice(0, -1)} not found for ID: ${id}`);
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                `${sentenceCase} not found`
            );
        }

        if (name !== undefined) entities[index].name = name;
        if (value !== undefined) entities[index].value = value;
        if (description !== undefined)
            entities[index].description = description;

        await redis.set(redisKey, JSON.stringify(entities));
        sentenceCase = toSentenceCase(entityName.slice(0, -1));
        console.debug(`${sentenceCase} updated successfully in Redis: ${id}`);

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            `${sentenceCase} updated successfully`,
            entities[index]
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const deleteValueByIdFromRedis = async (
    request,
    context,
    redisKey,
    entityName
) => {
    console.debug(
        `Starting process to delete a specific ${entityName.slice(0, -1)}`
    );

    try {
        const { params } = context;
        const id = params.id;
        console.debug(`Deleting ${entityName.slice(0, -1)} with ID: ${id}`);

        const existingData = await redis.get(redisKey);
        let entities = existingData ? JSON.parse(existingData) : [];
        const originalCount = entities.length;

        entities = entities.filter((entity) => entity.id !== id);

        await redis.set(redisKey, JSON.stringify(entities));
        console.debug(
            `Deleted ${entityName.slice(0, -1)} from Redis: ${id}, affected count: ${originalCount - entities.length}`
        );

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            `${toSentenceCase(entityName.slice(0, -1))} deleted successfully`,
            entities
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const createOrUpdateSetValuesToRedis = async (
    request,
    fileName,
    redisKey,
    entityName
) => {
    console.debug(`Starting ${entityName} add process`);

    try {
        const filePath = path.resolve('vendor/', fileName);
        const data = await fs.readFile(filePath, 'utf8');
        const domains = data
            .split(/\r?\n/)
            .filter((line) => line.trim() !== '');
        if (domains.length > 0) {
            // Using the correct method name `sadd`
            await redis.sadd(redisKey, domains);
            console.log(`${entityName} loaded into Redis`);
        }

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            `${entityName} loaded successfully.`,
            domains
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const addNewSetValuesToRedis = async (request, redisKey, key, entityName) => {
    console.debug(`Starting ${entityName} add process`);

    try {
        // Adding the domain to the Redis set 'blockedDomains'
        const result = await redis.sadd(redisKey, key);
        const sentenceCase = toSentenceCase(entityName);
        console.debug(`${sentenceCase} added to Redis, Result: ${result}`);

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            `${sentenceCase} added successfully.`
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const getSetValuesFromRedis = async (request, redisKey, entityName) => {
    console.debug(`Starting process to retrieve ${entityName}`);

    try {
        const data = await redis.smembers(redisKey);
        if (!data) {
            console.error(`No ${entityName} data found in Redis.`);
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                `No ${entityName} data found`,
                {}
            );
        }

        console.debug(`Successfully retrieved ${entityName} from Redis.`);
        return sendResponse(
            request,
            true,
            httpStatus.OK,
            `${toSentenceCase(entityName)} retrieved successfully`,
            data
        );
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const checkSetValueInRedis = async (request, redisKey, data, entityName) => {
    console.debug(`Starting process to retrieve ${entityName}`);

    try {
        // Check if the domain exists in the 'blockedDomains' set
        const exists = await redis.sismember(redisKey, data);
        console.debug(`${entityName} existence check, Result: ${exists}`);

        // Respond based on the existence of the domain
        if (exists === 1) {
            return sendResponse(
                request,
                true,
                httpStatus.OK,
                `${entityName} exists in the blocked list.`,
                { exists: true }
            );
        } else {
            return sendResponse(
                request,
                true,
                httpStatus.OK,
                `${entityName} does not exist in the blocked list.`,
                { exists: false }
            );
        }
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const deleteSetValuesFromRedis = async (request, redisKey, entityName) => {
    console.debug(`Starting process to delete ${entityName}`);

    try {
        // Delete the 'blockedDomains' set from Redis
        const result = await redis.del(redisKey);
        console.debug(`All ${entityName} set deleted, Result: ${result}`);

        // Check if to delete was successful
        if (result === 1) {
            return sendResponse(
                request,
                true,
                httpStatus.OK,
                `All ${entityName} have been successfully deleted.`
            );
        } else {
            return sendResponse(
                request,
                true,
                httpStatus.NOT_FOUND,
                `No ${entityName} to delete.`
            );
        }
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const deleteSetValueFromRedis = async (request, redisKey, data, entityName) => {
    console.debug(`Starting process to delete ${entityName}`);

    try {
        // Attempt to remove the domain from the 'blockedDomains' set
        const removed = await redis.srem(redisKey, data);
        console.debug(`${entityName} removal attempt, Result: ${removed}`);

        // Respond based on the result of the removal
        if (removed === 1) {
            return sendResponse(
                request,
                true,
                httpStatus.OK,
                `${entityName} successfully removed from the blocked list.`
            );
        } else {
            return sendResponse(
                request,
                true,
                httpStatus.NOT_FOUND,
                `${entityName} not found in the blocked list or already removed.`
            );
        }
    } catch (error) {
        return sendErrorResponse(request, error);
    }
};

const service = {
    createOrUpdateDefaults,
    getValuesFromRedis,
    deleteValuesFromRedis,
    getValueByIdFromRedis,
    updateValueByIdInRedis,
    deleteValueByIdFromRedis,
    createOrUpdateSetValuesToRedis,
    addNewSetValuesToRedis,
    getSetValuesFromRedis,
    checkSetValueInRedis,
    deleteSetValuesFromRedis,
    deleteSetValueFromRedis,
};

export default service;
