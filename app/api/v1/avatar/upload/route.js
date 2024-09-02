import { put } from '@vercel/blob';

import httpStatus from '@/constants/httpStatus.constants';

import sendResponse from '@/utilities/sendResponse';

export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    // ⚠️ The below code is for App Router Route Handlers only
    const blob = await put(filename, request.body, {
        access: 'public',
    });

    // Here's the code for Pages API Routes:
    // const blob = await put(filename, request, {
    //   access: 'public',
    // });

    return sendResponse(
        request,
        true,
        httpStatus.OK,
        'File uploaded successfully.',
        blob
    );
}

// The next lines are required for Pages API Routes only
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
