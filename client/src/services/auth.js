import axios from "axios";
const baseURL = import.meta.env.VITE_API;

export const registerUser = async (data) => {
    return await axios.post(`${baseURL}/api/register`, data);
}

export const loginUser = async (data) => {
    return await axios.post(`${baseURL}/api/login`, data);
}


export const currentUser = async (authtoken) => {
    return await axios.post(`${baseURL}/api/current-user`, {}, {
        headers: {
            authtoken
        }
    });

}
