import { NextResponse } from 'next/server';

import databaseService from '@/service/database.service';
import serverApiCall from '@/utilities/axios.server';

import getContentTypeByName from '@/utilities/getContentTypeByName';
import incrementUse from '@/utilities/incrementUse';

const sendResponse = async (
    request,
    success,
    status,
    message,
    data = {},
    headers = {
        'Content-Type': getContentTypeByName('JSON'),
    }
) => {
    console.debug('Connecting to database service');
    await databaseService.connect();

    console.debug('Incrementing authentication module usage');
    await incrementUse();

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
