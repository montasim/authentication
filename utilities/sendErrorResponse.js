import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import getEnvironmentByName from '@/utilities/getEnvironmentByName';

const sendErrorResponse = (request, error) =>
    sendResponse(
        request,
        false,
        httpStatus.INTERNAL_SERVER_ERROR,
        configuration.env !== getEnvironmentByName('PRODUCTION')
            ? error.message
            : 'Internal Server Error.'
    );

export default sendErrorResponse;
