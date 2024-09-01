import defaultValues from '@/constants/defaultGenderImages.json';

const getDefaultValueByName = (defaultValueName) => {
    const defaultValuesObject = defaultValues.find(
        (defaultValue) => defaultValue.name === defaultValueName
    );

    if (!defaultValuesObject) {
        throw new Error(
            `Default value with name "${defaultValueName}" not found in the default values array.`
        );
    }

    return new RegExp(defaultValuesObject.value);
};

export default getDefaultValueByName;
