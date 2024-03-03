import axios from "axios";
const baseURL = import.meta.env.VITE_API;

export const createMessage = async (data) => {
    return await axios.post(`${baseURL}/api/message`, data);
}

export const getMessage = async (id) => {
    return await axios.get(`${baseURL}/api/message/` + id);
}