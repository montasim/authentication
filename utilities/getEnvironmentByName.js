import environmentsConstants from '@/constants/environments.json';

const getEnvironmentByName = (environmentName) => {
    const environmentsObject = environmentsConstants.find(
        (environment) => environment.name === environmentName
    );

    if (!environmentsObject) {
        throw new Error(
            `Environment with name "${environmentName}" not found in the environments array.`
        );
    }

    return new RegExp(environmentsObject.value);
};

export default getEnvironmentByName;
