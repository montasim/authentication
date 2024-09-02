import service from '@/shared/service';

export const POST = async (request) => {
    const newDomain = await request.json();
    console.debug(`Received domain data: ${JSON.stringify(newDomain.domain)}`);

    return await service.addNewSetValuesToRedis(
        request,
        'blockedDomains',
        newDomain.domain,
        'blocked domains'
    );
};

export const GET = async (request) => {
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
