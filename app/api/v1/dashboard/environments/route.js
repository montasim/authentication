import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateDefaults(
        request,
        'environments.json',
        'environments',
        'environments'
    );
};

export const GET = async (request) => {
    return await service.getValuesFromRedis(
        request,
        'environments',
        'environments'
    );
};

export const DELETE = async (request) => {
    return await service.deleteValuesFromRedis(
        request,
        'environments',
        'environments'
    );
};
