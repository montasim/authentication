import service from '@/shared/service';

export const GET = async (request, context) => {
    return await service.getValueByIdFromRedis(
        request,
        context,
        'activityTypes',
        'activity types'
    );
};

export const PUT = async (request, context) => {
    return await service.updateValueByIdInRedis(
        request,
        context,
        'activityTypes',
        'activity types'
    );
};

export const DELETE = async (request, context) => {
    return await service.deleteValueByIdFromRedis(
        request,
        context,
        'activityTypes',
        'activity types'
    );
};
