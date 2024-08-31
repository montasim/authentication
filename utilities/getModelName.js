import formatModelName from '@/utilities/formatModelName';

/**
 * Generates a formatted model name based on a provided type. The function first capitalizes the first letter of the type,
 * appends 'Model' to the end, and then validates the resulting string using the formatModelName function.
 *
 * @param {string} type - The base type from which the model name is derived.
 * @returns {string} - The correctly formatted and validated model name ready for use in defining database models.
 * @throws {Error} - Propagates any errors thrown by the formatModelName function.
 */
const getModelName = (type) => {
    const modelName = type.charAt(0).toUpperCase() + type.slice(1);

    return formatModelName(modelName);
};

export default getModelName;
