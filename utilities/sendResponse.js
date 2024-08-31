import { NextResponse } from 'next/server';
import getContentTypeByName from '@/utilities/getContentTypeByName';

const sendResponse = (
    request,
    success,
    status,
    message,
    data = {},
    headers = {
        'Content-Type': getContentTypeByName('JSON'),
    }
) => {
    toString(status).startsWith('5')
        ? console.error(message)
        : console.debug(message);

    const response = {
        success,
        status,
        message,
        data,
        timeStamp: new Date().toTimeString(),
        route: request.url,
    };

    return new NextResponse(JSON.stringify(response), {
        status: response.status,
        headers: {
            ...headers,
        },
    });
};

export default sendResponse;
