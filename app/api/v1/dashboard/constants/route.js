import service from '@/shared/service';

export const POST = async (request) => {
    return service.createOrUpdateDefaults(
        request,
        'constants.json',
        'constants',
        'constants'
    );
};

export const GET = async (request) => {
    return service.getValuesFromRedis(request, 'constants', 'constants');
};

export const DELETE = async (request) => {
    return service.deleteValuesFromRedis(request, 'constants', 'constants');
};
