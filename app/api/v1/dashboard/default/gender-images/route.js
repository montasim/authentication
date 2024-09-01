import service from '@/shared/service';

export const POST = async (request) => {
    return service.createOrUpdateDefaults(
        request,
        'defaultGenderImages.json',
        'defaultGenderImages',
        'default gender images'
    );
};

export const GET = async (request) => {
    return service.getValuesFromRedis(
        request,
        'defaultGenderImages',
        'default gender images'
    );
};

export const DELETE = async (request) => {
    return service.deleteValuesFromRedis(
        request,
        'defaultGenderImages',
        'default gender images'
    );
};
