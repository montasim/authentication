import Redis from 'ioredis';
import fs from 'fs/promises';
import path from 'path';

import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import getEnvironmentByName from '@/utilities/getEnvironmentByName';

const redis = new Redis(configuration.redis.url);

export const GET = async (request, context) => {
    try {
        const { params } = context;
        const id = params.id;
        const existingData = await redis.get('activityTypes');
        const activityTypes = existingData ? JSON.parse(existingData) : [];
        const index = activityTypes.findIndex((type) => type.id === id);
        if (index === -1) {
            console.warn('Activity type not found:', id);
            return sendResponse(
                request,
                false,
                httpStatus.NOT_FOUND,
                'Activity type not found'
            );
        }
        console.debug('Retrieved activity types from Redis.');
        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Activity type retrieved successfully',
            activityTypes[index]
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

export const PUT = async (request, context) => {
    try {
        const { params } = context;
        const id = params.id;
        const { value, name, description } = await request.json();
        const existingData = await redis.get('activityTypes');
        const activityTypes = existingData ? JSON.parse(existingData) : [];

        const index = activityTypes.findIndex((type) => type.id === id);
        if (index === -1) {
            console.warn('Activity type not found:', id);
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
        console.debug('Updated activity type in Redis:', id);

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Activity type updated successfully',
            activityTypes[index]
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

export const DELETE = async (request, context) => {
    try {
        const { params } = context;
        const id = params.id;
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
