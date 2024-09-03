import { list } from '@vercel/blob';

import httpStatus from '@/constants/httpStatus.constants';

import sendResponse from '@/utilities/sendResponse';
import sendErrorResponse from '@/utilities/sendErrorResponse';

export const GET = async (request) => {
    try {
        const { blobs } = await list();

        return await sendResponse(
            request,
            true,
            httpStatus.OK,
            'File fetched successfully.',
            blobs
        );
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
};
