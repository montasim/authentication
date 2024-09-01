import Redis from 'ioredis';

import service from '@/shared/service';
import configuration from '@/configuration/configuration';

const redis = new Redis(configuration.redis.url);

export const GET = async (request, context) => {
    return service.getValueByIdFromRedis(
        request,
        context,
        'constants',
        'constants'
    );
};

export const PUT = async (request, context) => {
    return service.updateValueByIdInRedis(
        request,
        context,
        'constants',
        'constants'
    );
};

export const DELETE = async (request, context) => {
    return service.deleteValueByIdFromRedis(
        request,
        context,
        'constants',
        'constants'
    );
};
