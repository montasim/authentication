import fs from 'fs';
import path from 'path';

import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import getEnvironmentByName from '@/utilities/getEnvironmentByName';

export const POST = async (request) => {
    const { id, value } = await request.json();

    const filePath = path.join(process.cwd(), 'constants/defaultUrls.json');

    try {
        // Read the existing JSON file
        const fileData = fs.readFileSync(filePath, 'utf8');
        const patterns = JSON.parse(fileData);

        // Find the pattern by ID and update its value
        const updatedUrls = patterns.map((url) =>
            url.id === id ? { ...url, value } : url
        );

        // Write the updated data back to the JSON file
        fs.writeFileSync(
            filePath,
            JSON.stringify(updatedUrls, null, 2),
            'utf8'
        );

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'Url updated successfully'
        );
    } catch (error) {
        return sendResponse(
            request,
            false,
            httpStatus.INTERNAL_SERVER_ERROR,
            configuration.env !== getEnvironmentByName('PRODUCTION')
                ? error.message
                : 'Internal Server Error.'
        );
    }
};
