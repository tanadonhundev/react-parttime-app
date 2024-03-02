import axios from "axios";
const baseURL = import.meta.env.VITE_API;

export const reportEmployee = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/reportmployee`, data, {
        headers: {
            authtoken
        }
    });
}

export const reportOwner = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/reportowner`, data, {
        headers: {
            authtoken
        }
    });
}