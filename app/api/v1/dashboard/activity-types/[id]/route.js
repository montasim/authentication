import Redis from 'ioredis';

import service from '@/shared/service';
import configuration from '@/configuration/configuration';

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
    return service.updateValueByIdInRedis(
        request,
        context,
        'activityTypes',
        'activity types'
    );
};

export const PATCH = async (request, context) => {
    return service.updateValueByIdInRedis(
        request,
        context,
        'activityTypes',
        'activity types'
    );
};

export const DELETE = async (request, context) => {
    return service.deleteValueByIdFromRedis(
        request,
        context,
        'activityTypes',
        'activity types'
    );
};
