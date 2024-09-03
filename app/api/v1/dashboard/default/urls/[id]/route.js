import service from '@/shared/service';

export const GET = async (request, context) => {
    return await service.getValueByIdFromRedis(
        request,
        context,
        'defaultUrls',
        'default urls'
    );
};

export const PUT = async (request, context) => {
    return await service.updateValueByIdInRedis(
        request,
        context,
        'defaultUrls',
        'default urls'
    );
};

export const DELETE = async (request, context) => {
    return await service.deleteValueByIdFromRedis(
        request,
        context,
        'defaultUrls',
        'default urls'
    );
};
