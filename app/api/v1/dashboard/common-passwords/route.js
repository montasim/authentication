import { promises as fsPromises } from 'fs';
import path from 'path';

import httpStatus from '@/constants/httpStatus.constants';
import configuration from '@/configuration/configuration';

import sendResponse from '@/utilities/sendResponse';
import getEnvironmentByName from '@/utilities/getEnvironmentByName';
import loadTempListFromFile from '@/utilities/loadTempListFromFile';

export const POST = async (request) => {
    try {
        const { content } = await request.json();
        const filePath = path.join(process.cwd(), 'vendor/commonPasswords.txt');
        await fsPromises.writeFile(filePath, content, 'utf8');

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'File saved successfully!'
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

export const GET = async (request) => {
    try {
        const data = await loadTempListFromFile('vendor/commonPasswords.txt');

        // If data is in Set format, convert it to an array
        const dataSet = new Set(data.split('\n').filter(Boolean)); // Remove empty lines and create a Set
        const dataArray = Array.from(dataSet); // Convert Set to Array

        return sendResponse(
            request,
            true,
            httpStatus.OK,
            'File fetched successfully!',
            dataArray.join('\n') // Join array back into a string to send as a response
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
