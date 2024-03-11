import axios from "axios";
const baseURL = import.meta.env.VITE_API;

export const report = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/report`, data, {
        headers: {
            authtoken
        }
    });
}

export const getReport = async (authtoken) => {
    return await axios.get(`${baseURL}/api/report`, {
        headers: {
            authtoken
        }
    });
}

