import { NextResponse } from 'next/server';

import databaseService from '@/service/database.service';
import serverApiCall from '@/utilities/axios.server';

import incrementUse from '@/utilities/incrementUse';

const sendResponse = async (
    request,
    success,
    status,
    message,
    data = {},
    headers = {}
) => {
    console.debug('Connecting to database service');
    await databaseService.connect();

    console.debug('Incrementing authentication module usage');
    await incrementUse();

    const contentTypeResponse = await serverApiCall.getData(
        '/api/v1/dashboard/content-types?name=JSON'
    );
    const contentType = await contentTypeResponse.data[0].value;

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
            'Content-Type': contentType, // Set default Content-Type header
            ...headers, // Override with provided headers if any
        },
    });
};

export default sendResponse;
