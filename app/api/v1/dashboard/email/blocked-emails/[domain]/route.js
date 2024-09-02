import service from '@/shared/service';

export const GET = async (request, context) => {
    const { params } = context;
    const domain = params.domain;
    console.debug(`Checking existence for domain: ${domain}`);

    return await service.checkSetValueInRedis(
        request,
        'blockedDomains',
        domain,
        'blocked domains'
    );
};

export const DELETE = async (request, context) => {
    const { params } = context;
    const domain = params.domain;
    console.debug(`Attempting to delete domain: ${domain}`);

    return await service.checkSetValueInRedis(
        request,
        'blockedDomains',
        domain,
        'blocked domains'
    );
};
