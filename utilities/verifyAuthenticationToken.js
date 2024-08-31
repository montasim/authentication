import jwt from 'jsonwebtoken';

import configuration from '@/configuration/configuration.js';

const verifyAuthenticationToken = async (token) => {
    try {
        return await jwt.verify(token, configuration.jwt.secret);
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error(error.message);
    }
};

export default verifyAuthenticationToken;
