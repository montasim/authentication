import service from '@/shared/service';

export const GET = async (request, context) => {
    return service.getValueByIdFromRedis(
        request,
        context,
        'contentTypes',
        'content types'
    );
};

export const PUT = async (request, context) => {
    return service.updateValueByIdInRedis(
        request,
        context,
        'contentTypes',
        'content types'
    );
};

export const DELETE = async (request, context) => {
    return service.deleteValueByIdFromRedis(
        request,
        context,
        'contentTypes',
        'content types'
    );
};
