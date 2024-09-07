import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateSetValuesToRedis(
        request,
        'temporaryEmailDomains.txt',
        'temporaryDomains',
        'temporary domains'
    );
};
