import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateDefaults(
        request,
        'activityTypes.json',
        'activityTypes',
        'activity types'
    );
};

export const GET = async (request) => {
    return await service.getValuesFromRedis(
        request,
        'activityTypes',
        'activity types'
    );
};

export const DELETE = async (request) => {
    return await service.deleteValuesFromRedis(
        request,
        'activityTypes',
        'activity types'
    );
};
