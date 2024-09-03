import service from '@/shared/service';

export const POST = async (request) => {
    return service.createOrUpdateDefaults(
        request,
        'defaultGenderImages.json',
        'defaultGenderImages',
        'default gender images'
    );
};

export const GET = async (request, context) => {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    return service.getValuesFromRedis(
        request,
        'defaultGenderImages',
        queryParams, // Pass the entire queryParams object, it could be empty
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
