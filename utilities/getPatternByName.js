import patternsConstants from '@/constants/patterns.json';

/**
 * Utility function to find a regex pattern by name from the patterns array.
 *
 * @param {string} patternName - The name of the pattern to search for.
 * @returns {RegExp} - The RegExp object for the found pattern.
 * @throws {Error} - Throws an error if the pattern is not found.
 */
const getPatternByName = (patternName) => {
    const patternObject = patternsConstants.find(
        (pattern) => pattern.name === patternName
    );

    if (!patternObject) {
        throw new Error(
            `Pattern with name "${patternName}" not found in the patterns array.`
        );
    }

    return new RegExp(patternObject.value);
};

export default getPatternByName;
