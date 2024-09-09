const getDataByCriteria = async (fileName, matchKey, matchValue) => {
    try {
        // Dynamically import the JSON file
        const data = (await import(`@/constants/${fileName}`)).default;

        // Find the object that matches the criteria
        const dataObject = data.find((item) => item[matchKey] === matchValue);

        if (!dataObject) {
            throw new Error(
                `Item with ${matchKey} "${matchValue}" not found in the ${fileName} array.`
            );
        }

        // Return the RegExp constructed from the value field of the matched object
        return new RegExp(dataObject.value);
    } catch (error) {
        throw new Error(
            `Failed to fetch data from ${fileName}: ${error.message}`
        );
    }
};

export default getDataByCriteria;
