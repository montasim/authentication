import service from '@/shared/service';

export const GET = async (request, context) => {
    const { params } = context;
    const password = params.password;
    console.debug(`Checking existence for domain: ${password}`);

    return await service.checkSetValueInRedis(
        request,
        'commonPasswords',
        password,
        'common passwords'
    );
};

export const DELETE = async (request, context) => {
    const { params } = context;
    const password = params.password;
    console.debug(`Attempting to delete domain: ${password}`);

    return await service.deleteSetValueFromRedis(
        request,
        'commonPasswords',
        password,
        'common passwords'
    );
};
