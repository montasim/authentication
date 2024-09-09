import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateDefaults(
        request,
        'usersPatterns.json',
        'usersPatterns',
        'users patterns'
    );
};

export const GET = async (request) => {
    return await service.getValuesFromRedis(
        request,
        'usersPatterns',
        'users patterns'
    );
};

export const DELETE = async (request) => {
    return await service.deleteValuesFromRedis(
        request,
        'usersPatterns',
        'users patterns'
    );
};
