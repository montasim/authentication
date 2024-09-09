import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://authentication-mocha-three.vercel.app',
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        config.headers['Token'] = '';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const handleAxiosError = (error) => {
    return error;
};

const getData = async (endpoint) => {
    try {
        const response = await axiosInstance.get(endpoint);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const createData = async (endpoint, data) => {
    try {
        const requestData =
            data instanceof FormData ? data : JSON.stringify({ ...data });
        const response = await axiosInstance.post(endpoint, requestData);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const updateData = async (endpoint, data) => {
    try {
        const isArray = Array.isArray(data);
        const headers = isArray
            ? { 'Content-Type': 'application/json', Hello: 'Hello' }
            : { 'Content-Type': 'application/json' };
        const requestData = isArray ? data : JSON.stringify({ ...data });
        const response = await axiosInstance.put(endpoint, requestData, {
            headers,
        });
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const deleteData = async (endpoint, id) => {
    const url = endpoint + id;
    try {
        const response = await axiosInstance.delete(url);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
};

const serverApiCall = {
    createData,
    getData,
    updateData,
    deleteData,
};

export default serverApiCall;
