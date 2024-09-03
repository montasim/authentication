import service from '@/shared/service';

export const GET = async (request, context) => {
    return await service.getValueByIdFromRedis(
        request,
        context,
        'defaultGenderImages',
        'default gender images'
    );
};

export const PUT = async (request, context) => {
    return await service.updateValueByIdInRedis(
        request,
        context,
        'defaultGenderImages',
        'default gender images'
    );
};

export const DELETE = async (request, context) => {
    return await service.deleteValueByIdFromRedis(
        request,
        context,
        'defaultGenderImages',
        'default gender images'
    );
};
