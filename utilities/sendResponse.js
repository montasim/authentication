import { NextResponse } from 'next/server';

const sendResponse = (request, response, headers) => {
    toString(response.status).startsWith('5')
        ? console.error(response.message)
        : console.debug(response.message);
    response.timeStamp = new Date().toTimeString();
    response.route = request.url;

    return new NextResponse(JSON.stringify(response), {
        status: response.status,
        headers: {
            ...headers,
        },
    });
};

export default sendResponse;
