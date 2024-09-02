import { del } from '@vercel/blob';

import httpStatus from '@/constants/httpStatus.constants';

import sendResponse from '@/utilities/sendResponse';

export const DELETE = async (request) => {
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    console.debug('Query Parameters:', queryParams);
    const deleteResult = await del(queryParams.url);

    return sendResponse(
        request,
        true,
        httpStatus.OK,
        'File deleted successfully.',
        { deleteResult }
    );
};
