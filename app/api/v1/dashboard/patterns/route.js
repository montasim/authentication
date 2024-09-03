import service from '@/shared/service';

export const POST = async (request) => {
    return await service.createOrUpdateDefaults(
        request,
        'patterns.json',
        'patterns',
        'patterns'
    );
};

export const GET = async (request) => {
    return await service.getValuesFromRedis(request, 'patterns', 'patterns');
};

export const DELETE = async (request) => {
    return await service.deleteValuesFromRedis(request, 'patterns', 'patterns');
};
