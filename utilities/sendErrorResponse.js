import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';
import serverApiCall from '@/utilities/axios.server';

import sendResponse from '@/utilities/sendResponse';

const sendErrorResponse = async (request, error) => {
    const [environmentNameProduction] = await Promise.all([
        serverApiCall.getData('/api/v1/dashboard/environments?name=PRODUCTION'),
    ]);

    return await sendResponse(
        request,
        false,
        httpStatus.INTERNAL_SERVER_ERROR,
        configuration.env !== (await environmentNameProduction?.data[0]?.value)
            ? error.message
            : 'Internal Server Error.'
    );
};

export default sendErrorResponse;
