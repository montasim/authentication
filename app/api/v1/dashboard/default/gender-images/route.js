import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateDefaults(
        request,
        'defaultGenderImages.json',
        'defaultGenderImages',
        'default gender images'
    );
};

export const GET = async (request, context) => {
    return await service.getValuesFromRedis(
        request,
        'defaultGenderImages',
        'default gender images'
    );
};

export const DELETE = async (request) => {
    return await service.deleteValuesFromRedis(
        request,
        'defaultGenderImages',
        'default gender images'
    );
};
