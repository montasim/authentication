import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';
import serverApiCall from '@/utilities/axios.server';

import sendResponse from '@/utilities/sendResponse';
import getDataByCriteria from '@/utilities/getDataByCriteria';

const sendErrorResponse = async (request, error) => {
    const [environmentNameApiResponse, environmentNameDefaultResponse] =
        await Promise.all([
            serverApiCall.getData(
                '/api/v1/dashboard/environments?name=PRODUCTION'
            ),
            getDataByCriteria('environments.json', 'name', 'PRODUCTION'),
        ]);

    let environmentNameProduction = new RegExp(environmentNameDefaultResponse);
    if (await environmentNameApiResponse?.data[0]?.value) {
        environmentNameProduction = new RegExp(
            environmentNameApiResponse?.data[0]?.value
        );
    }

    return await sendResponse(
        request,
        false,
        httpStatus.INTERNAL_SERVER_ERROR,
        configuration.env !== environmentNameProduction
            ? error.message
            : 'Internal Server Error.'
    );
};

export default sendErrorResponse;
