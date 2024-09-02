import service from '@/shared/service';

export const GET = async (request, context) => {
    return service.getValueByIdFromRedis(
        request,
        context,
        'constants',
        'constants'
    );
};

export const PUT = async (request, context) => {
    return service.updateValueByIdInRedis(
        request,
        context,
        'constants',
        'constants'
    );
};

export const DELETE = async (request, context) => {
    return service.deleteValueByIdFromRedis(
        request,
        context,
        'constants',
        'constants'
    );
};
