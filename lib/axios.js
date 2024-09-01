import axios from 'axios';
import ApiConfig from '@/configs/ApiConfig';
import { refreshToken } from './refreshToken';
import { getTokenFromCookie, logoutUser } from './auth';
import { toast } from 'sonner';

const axiosInstance = axios.create({
    baseURL: ApiConfig?.BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginAxiosInstance = axios.create({
    baseURL: ApiConfig?.BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Add any other default headers here
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = getTokenFromCookie();
        config.headers['Token'] = token ? token : '';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const handleAxiosError = (error) => {
    if (error.response) {
        const code = error.response.status;
        if (code === 401) {
            logoutUser(true);
        }
        // Handle the case when the detail field is an array
        const errorDetail = Array.isArray(error.response.data.detail)
            ? error.response.data.detail.map((detail) => detail.msg).join(', ')
            : error.response.data.detail;

        toast.error(`Server error: ${code} - ${errorDetail}`);
    } else if (error.request) {
        toast.error('Network error: No response received from server.');
    } else {
        toast.error('Axios error: ' + error.message);
    }
    throw error; // Propagate the error for handling in calling code if necessary
};

export async function fetchData(endpoint) {
    try {
        const response = await axiosInstance.get(endpoint);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function fetchDataInSSR(endpoint, headers = {}) {
    try {
        const response = await axiosInstance.get(endpoint, { headers });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.log(
                `Server error: ${error.response.status} - ${error.response.data.detail || error.response.data}`
            );
        } else if (error.request) {
            console.log('Network error: No response received from server.');
        } else {
            console.log('Axios error:' + error.message);
        }
        throw error; // Propagate the error for handling in calling code
    }
}

export async function postData(endpoint, data) {
    try {
        const requestData =
            data instanceof FormData ? data : JSON.stringify({ ...data });
        const response = await axiosInstance.post(endpoint, requestData);
        const message =
            response?.data?.detail || 'Unexpected response from server';
        toast.success(message);
        return response.data;
    } catch (error) {
        handleAxiosError(error);
    }
}

export async function putData(endpoint, data) {
    try {
        const isArray = Array.isArray(data);
        const headers = isArray
            ? { 'Content-Type': 'application/json', Hello: 'Hello' }
            : { 'Content-Type': 'application/json' };
        const requestData = isArray ? data : JSON.stringify({ ...data });

        const response = await axiosInstance.put(endpoint, requestData, {
            headers,
        });
        const message =
            response?.data?.detail || 'Unexpected response from server';
        toast.success(message);
        console.log('Response:', response);
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

// Initial token refresh
refreshToken();
setInterval(refreshToken, 4 * 60 * 1000);

export default axiosInstance;
