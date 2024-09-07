import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateDefaults(
        request,
        'accountStatus.json',
        'accountStatus',
        'account status'
    );
};

export const GET = async (request) => {
    return await service.getValuesFromRedis(
        request,
        'accountStatus',
        'account status'
    );
};

export const DELETE = async (request) => {
    return await service.deleteValuesFromRedis(
        request,
        'accountStatus',
        'account status'
    );
};
