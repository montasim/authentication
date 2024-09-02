import service from '@/shared/service';

export const POST = async (request) => {
    const newDomain = await request.json();
    console.debug(`Received domain data: ${JSON.stringify(newDomain.domain)}`);

    return await service.addNewSetValuesToRedis(
        request,
        'temporaryDomains',
        newDomain.domain,
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
