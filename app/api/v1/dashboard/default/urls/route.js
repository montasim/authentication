import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateDefaults(
        request,
        'defaultUrls.json',
        'defaultUrls',
        'default urls'
    );
};

export const GET = async (request) => {
    return await service.getValuesFromRedis(
        request,
        'defaultUrls',
        'default urls'
    );
};

export const DELETE = async (request) => {
    return await service.deleteValuesFromRedis(
        request,
        'defaultUrls',
        'default urls'
    );
};
