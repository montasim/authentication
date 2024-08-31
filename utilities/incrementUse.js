import UsesModel from '@/app/api/v1/uses/uses.model';

/**
 * Increments the 'use' count by 1.
 *
 * @returns {Promise<Object>} - The updated document with the incremented 'use' value.
 */
const incrementUse = async () => {
    try {
        const updatedDocument = await UsesModel.findOneAndUpdate(
            {}, // You can add a filter here if necessary, for now, it will update the first found document.
            { $inc: { use: 1 } }, // Increment the 'use' field by 1
            { new: true, upsert: true } // Return the updated document and create a new one if it doesn't exist
        );
        console.debug(
            `Incremented use value successfully: ${updatedDocument.use}`
        );
        return updatedDocument;
    } catch (error) {
        console.error(`Error incrementing use value: ${error}`);
        throw error;
    }
};

export default incrementUse;
