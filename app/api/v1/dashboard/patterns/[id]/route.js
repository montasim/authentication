import service from '@/shared/service';

export const GET = async (request, context) => {
    return service.getValueByIdFromRedis(
        request,
        context,
        'patterns',
        'patterns'
    );
};

export const PUT = async (request, context) => {
    return service.updateValueByIdInRedis(
        request,
        context,
        'patterns',
        'patterns'
    );
};

export const DELETE = async (request, context) => {
    return service.deleteValueByIdFromRedis(
        request,
        context,
        'patterns',
        'patterns'
    );
};
