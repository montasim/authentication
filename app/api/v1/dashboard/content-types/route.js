import service from '@/shared/service';

export const POST = async (request) => {
    return service.createOrUpdateDefaults(
        request,
        'contentTypes.json',
        'contentTypes',
        'content types'
    );
};

export const GET = async (request) => {
    return service.getValuesFromRedis(request, 'contentTypes', 'content types');
};

export const DELETE = async (request) => {
    return service.deleteValuesFromRedis(
        request,
        'contentTypes',
        'content types'
    );
};
