import service from '@/shared/service';

export const POST = async (request) => {
    return await service.addNewSetValuesToRedis(
        request,
        'temporaryDomains',
        'temporary domains'
    );
};

export const GET = async (request, response) => {
    return await service.getSetValuesFromRedis(
        request,
        'temporaryDomains',
        'temporary domains'
    );
};

export const DELETE = async (request) => {
    return await service.deleteSetValuesFromRedis(
        request,
        'temporaryDomains',
        'temporary domains'
    );
};
