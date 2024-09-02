import axios from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
    baseURL: '',
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
    if (error.response.status.startWith('5')) {
        const code = error.response.status;
        // Handle the case when the detail field is an array
        const errorDetail = error.response.data.message;

        toast.error(`${code} - ${errorDetail}`);
    } else if (error.request) {
        toast.error('Network error: No response received from server.');
    } else {
        toast.error(`Axios error: ${error.message}`);
    }
    throw error; // Propagate the error for handling in calling code if necessary
};

export async function getData(endpoint) {
    try {
        const response = await axiosInstance.get(endpoint);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function createData(endpoint, data) {
    try {
        const requestData =
            data instanceof FormData ? data : JSON.stringify({ ...data });
        const response = await axiosInstance.post(endpoint, requestData);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function updateData(endpoint, data) {
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
}

export async function deleteData(endpoint, id) {
    const url = endpoint + id;
    try {
        const response = await axiosInstance.delete(url);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export default axiosInstance;
