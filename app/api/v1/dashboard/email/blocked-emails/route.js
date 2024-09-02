import service from '@/shared/service';

export const POST = async (request) => {
    return await service.addNewSetValuesToRedis(
        request,
        'blockedDomains',
        'blocked domains'
    );
};

export const GET = async (request, response) => {
    return await service.getSetValuesFromRedis(
        request,
        'blockedDomains',
        'blocked domains'
    );
};

export const DELETE = async (request) => {
    return await service.deleteSetValuesFromRedis(
        request,
        'blockedDomains',
        'blocked domains'
    );
};
