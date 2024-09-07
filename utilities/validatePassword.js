/**
 * @fileoverview This file exports an asynchronous function `validatePassword` which validates
 * a password based on multiple criteria. It checks the password's length, presence of
 * uppercase and lowercase letters, digits, and special characters. It also checks for
 * simple patterns and common passwords.
 */

import serverApiCall from '@/utilities/axios.server';

/**
 * validatePassword - An asynchronous function that validates a password based on several criteria.
 * It checks if the password is between 8 and 20 characters, contains at least one uppercase letter,
 * one lowercase letter, one digit, and one special character. The function also checks for simple
 * patterns or common passwords and ensures that the password is not listed in a common passwords file.
 *
 * @function
 * @async
 * @param {string} password - The password to validate.
 * @returns {Promise<string>} - A promise that resolves to 'Valid' if the password passes all checks,
 * or an appropriate error message if it fails any check.
 */
const validatePassword = async (password) => {
    // Execute API calls in parallel to reduce waiting time
    const [passwordPatternResponse, isCommonPasswordResponse] =
        await Promise.all([
            serverApiCall.getData('/api/v1/dashboard/patterns?name=PASSWORD'),
            serverApiCall.getData(
                `/api/v1/dashboard/common-passwords/${password}`
            ),
        ]);

    // Validate the email pattern
    const passwordRegex = new RegExp(passwordPatternResponse.data[0].value);
    if (!passwordRegex.test(password)) {
        return 'Password must be a valid password';
    }

    // Check if the password is in the Set of common passwords
    if (isCommonPasswordResponse?.exists) {
        console.error(
            `Password "${password}" is found in the common passwords list.`
        );
        return 'Use of common password is not allowed';
    }

    // If all checks pass, return a success message or the valid password
    return 'Valid';
};

export default validatePassword;
