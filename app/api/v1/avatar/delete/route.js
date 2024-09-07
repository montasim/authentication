import { del } from '@vercel/blob';

import httpStatus from '@/constants/httpStatus.constants';

import sendResponse from '@/utilities/sendResponse';
import sendErrorResponse from '@/utilities/sendErrorResponse';

export const DELETE = async (request) => {
    try {
        const url = new URL(request.url);
        const queryParams = Object.fromEntries(url.searchParams.entries());
        console.debug('Query Parameters:', queryParams);
        const deleteResult = await del(queryParams.url);

        return await sendResponse(
            request,
            true,
            httpStatus.OK,
            'File deleted successfully.',
            deleteResult
        );
    } catch (error) {
        return await sendErrorResponse(request, error);
    }
};
