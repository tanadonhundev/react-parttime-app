import axios from "axios";
const baseURL = import.meta.env.VITE_API;

export const reviewEmployee = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/reviewemployee`, data, {
        headers: {
            authtoken
        }
    });
}

export const reviewOwner = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/reviewowner`, data, {
        headers: {
            authtoken
        }
    });
}

export const getReviewEmployee = async (authtoken, id) => {
    return await axios.get(`${baseURL}/api/reviewemployee/` + id, {
        headers: {
            authtoken,
        },
    });
};