import service from '@/shared/service';

export const GET = async (request, context) => {
    const { params } = context;
    const domain = params.domain;
    console.debug(`Checking existence for domain: ${domain}`);

    return await service.checkSetValueInRedis(
        request,
        'temporaryDomains',
        domain,
        'temporary domains'
    );
};

export const DELETE = async (request, context) => {
    const { params } = context;
    const domain = params.domain;
    console.debug(`Attempting to delete domain: ${domain}`);

    return await service.deleteSetValueFromRedis(
        request,
        'temporaryDomains',
        domain,
        'temporary domains'
    );
};
