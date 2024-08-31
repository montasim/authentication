/**
 * Validates the provided input to ensure it contains only alphabetic characters.
 * If invalid, returns false; otherwise, it returns the unaltered input.
 *
 * @param {string} input - The input string to validate as a model name.
 * @returns {string|boolean} - The original input if valid, otherwise false.
 */
export const formatModelName = (input) => {
    if (!input.match(/^[A-Za-z]+$/)) {
        console.debug(
            `Invalid model name provided: ${input}. Only alphabetic characters without spaces or special characters are allowed.`
        );
        return false;
    }

    return input;
};

export default formatModelName;
