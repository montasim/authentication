import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateDefaults(
        request,
        'usersConstants.json',
        'usersConstants',
        'users constants'
    );
};

export const GET = async (request) => {
    return await service.getValuesFromRedis(
        request,
        'usersConstants',
        'users constants'
    );
};

export const DELETE = async (request) => {
    return await service.deleteValuesFromRedis(
        request,
        'usersConstants',
        'users constants'
    );
};
