import service from '@/shared/service';

export const POST = async (request) => {
    return service.createOrUpdateDefaults(
        request,
        'environments.json',
        'environments',
        'environments'
    );
};

export const GET = async (request) => {
    return service.getValuesFromRedis(request, 'environments', 'environments');
};

export const DELETE = async (request) => {
    return service.deleteValuesFromRedis(
        request,
        'environments',
        'environments'
    );
};
