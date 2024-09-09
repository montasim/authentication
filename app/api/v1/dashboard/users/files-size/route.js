import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateDefaults(
        request,
        'usersFilesSize.json',
        'usersFilesSize',
        'users files size'
    );
};

export const GET = async (request) => {
    return await service.getValuesFromRedis(
        request,
        'usersFilesSize',
        'users files size'
    );
};

export const DELETE = async (request) => {
    return await service.deleteValuesFromRedis(
        request,
        'usersFilesSize',
        'users files size'
    );
};
