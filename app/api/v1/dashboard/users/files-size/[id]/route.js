import service from '@/shared/service';

export const GET = async (request, context) => {
    return await service.getValueByIdFromRedis(
        request,
        context,
        'usersFilesSize',
        'users files size'
    );
};

export const PUT = async (request, context) => {
    return await service.updateValueByIdInRedis(
        request,
        context,
        'usersFilesSize',
        'users files size'
    );
};

export const DELETE = async (request, context) => {
    return await service.deleteValueByIdFromRedis(
        request,
        context,
        'usersFilesSize',
        'users files size'
    );
};
