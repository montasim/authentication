import service from '@/shared/service';

export const POST = async (request) => {
    return service.createOrUpdateDefaults(
        request,
        'patterns.json',
        'patterns',
        'patterns'
    );
};

export const GET = async (request) => {
    return service.getValuesFromRedis(request, 'patterns', 'patterns');
};

export const DELETE = async (request) => {
    return service.deleteValuesFromRedis(request, 'patterns', 'patterns');
};
