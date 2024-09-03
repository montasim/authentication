import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateDefaults(
        request,
        'constants.json',
        'constants',
        'constants'
    );
};

export const GET = async (request) => {
    return await service.getValuesFromRedis(request, 'constants', 'constants');
};

export const DELETE = async (request) => {
    return await service.deleteValuesFromRedis(
        request,
        'constants',
        'constants'
    );
};
