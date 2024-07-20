import axios from "axios";
const baseURL = import.meta.env.VITE_API;

export const unreadMessage = async (data) => {
    return await axios.post(`${baseURL}/api/unreadMessages`, data);
}

export const FindunreadMessage = async (userId) => {
    return await axios.get(`${baseURL}/api/unreadMessages/${userId}`);
}
