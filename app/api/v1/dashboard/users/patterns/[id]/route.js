import service from '@/shared/service';

export const GET = async (request, context) => {
    return await service.getValueByIdFromRedis(
        request,
        context,
        'usersPatterns',
        'users patterns'
    );
};

export const PUT = async (request, context) => {
    return await service.updateValueByIdInRedis(
        request,
        context,
        'usersPatterns',
        'users patterns'
    );
};

export const DELETE = async (request, context) => {
    return await service.deleteValueByIdFromRedis(
        request,
        context,
        'usersPatterns',
        'users patterns'
    );
};
