import { list } from '@vercel/blob';

import httpStatus from '@/constants/httpStatus.constants';

import sendResponse from '@/utilities/sendResponse';

export const GET = async (request) => {
    const { blobs } = await list();

    return sendResponse(
        request,
        true,
        httpStatus.OK,
        'File fetched successfully.',
        blobs
    );
};
