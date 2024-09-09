/**
 * @fileoverview This file exports an asynchronous function `validateEmail` which validates
 * an email address against various criteria. It checks if the email format is valid,
 * ensures the email domain is not blocked or temporary, and prevents the use of email addresses
 * with a "+number" pattern. The function utilizes regular expressions and external lists of
 * blocked and temporary email domains.
 */

import serverApiCall from '@/utilities/axios.server';

import getDataByCriteria from '@/utilities/getDataByCriteria';

/**
 * validateEmail - An asynchronous function that validates an email address against various criteria.
 * It checks if the email format is valid, ensures the email domain is not blocked or temporary, and
 * prevents the use of email addresses with a "+number" pattern. If the email passes all checks, it
 * returns 'Valid'; otherwise, it returns an appropriate error message.
 *
 * @function
 * @async
 * @param {string} email - The email address to validate.
 * @returns {Promise<string>} - A promise that resolves to 'Valid' if the email passes all checks,
 * or an appropriate error message if it fails any check.
 */
const validateEmail = async (email) => {
    const domain = email.split('@')[1].toLowerCase();

    // Execute API calls in parallel to reduce waiting time
    const [
        emailPatternApiResponse,
        emailPatternDefaultResponse,
        isBlockedDomainResponse,
        isTemporaryDomainResponse,
    ] = await Promise.all([
        serverApiCall.getData('/api/v1/dashboard/patterns?name=EMAIL'),
        getDataByCriteria('patterns.json', 'name', 'EMAIL'),
        serverApiCall.getData(
            `/api/v1/dashboard/email/blocked-emails/${domain}`
        ),
        serverApiCall.getData(
            `/api/v1/dashboard/email/temporary-emails/${domain}`
        ), // Seems like the same endpoint, confirm if needed
    ]);

    // Validate the email pattern
    let emailRegex = new RegExp(emailPatternDefaultResponse);
    if (await emailPatternApiResponse?.data[0]?.value) {
        emailRegex = new RegExp(emailPatternApiResponse?.data[0]?.value);
    }

    if (!emailRegex.test(email)) {
        return 'Email must be a valid email';
    }

    // Check if the domain is blocked
    if (await isBlockedDomainResponse?.data?.exists) {
        return 'Email services is not allowed';
    }

    // Check if it's a temporary domain
    if (await isTemporaryDomainResponse?.data?.exists) {
        return 'Use of temporary email services is not allowed';
    }

    // Check if the email contains "+number"
    if (email.split('@')[0].match(/\+\d+$/)) {
        return 'Emails with a "+number" pattern are not allowed';
    }

    return 'Valid'; // Return 'Valid' if all checks pass
};

export default validateEmail;
