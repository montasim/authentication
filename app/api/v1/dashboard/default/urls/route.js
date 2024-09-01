import service from '@/shared/service';

export const POST = async (request) => {
    return service.createOrUpdateDefaults(
        request,
        'defaultUrls.json',
        'defaultUrls',
        'default urls'
    );
};

export const GET = async (request) => {
    return service.getValuesFromRedis(request, 'defaultUrls', 'default urls');
};

export const DELETE = async (request) => {
    return service.deleteValuesFromRedis(
        request,
        'defaultUrls',
        'default urls'
    );
};
