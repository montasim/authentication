import service from '@/shared/service';

export const POST = async (request) => {
    const newPassword = await request.json();
    console.debug(
        `Received domain data: ${JSON.stringify(newPassword.password)}`
    );

    return await service.addNewSetValuesToRedis(
        request,
        'commonPasswords',
        newPassword.password,
        'common passwords'
    );
};

export const GET = async (request) => {
    return await service.getSetValuesFromRedis(
        request,
        'commonPasswords',
        'common passwords'
    );
};

export const DELETE = async (request) => {
    return await service.deleteSetValuesFromRedis(
        request,
        'commonPasswords',
        'common passwords'
    );
};
