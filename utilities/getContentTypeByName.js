import contentTypes from '@/constants/contentTypes.json';

const getContentTypeByName = (contentTypeName) => {
    const contentTypesObject = contentTypes.find(
        (contentType) => contentType.name === contentTypeName
    );

    if (!contentTypesObject) {
        throw new Error(
            `Content type with name "${contentTypeName}" not found in the content types array.`
        );
    }

    return new RegExp(contentTypesObject.value);
};

export default getContentTypeByName;
