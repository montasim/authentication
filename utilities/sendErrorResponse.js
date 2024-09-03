import databaseService from '@/service/database.service';
import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import getEnvironmentByName from '@/utilities/getEnvironmentByName';
import incrementUse from '@/utilities/incrementUse';

const sendErrorResponse = async (request, error) => {
    console.debug('Connecting to database service');
    await databaseService.connect();

    console.debug('Incrementing authentication module usage');
    await incrementUse();

    return await sendResponse(
        request,
        false,
        httpStatus.INTERNAL_SERVER_ERROR,
        configuration.env !== getEnvironmentByName('PRODUCTION')
            ? error.message
            : 'Internal Server Error.'
    );
};

export default sendErrorResponse;
