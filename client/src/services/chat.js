import axios from "axios";
const baseURL = import.meta.env.VITE_API;

export const createChat = async (data) => {
    return await axios.post(`${baseURL}/api/chats`, data);
}

export const findUserChats = async (id) => {
    return await axios.get(`${baseURL}/api/chats/` + id);
}

export const findChats = async (id, id1) => {
    return await axios.get(`${baseURL}/api/chats/find/${id}/${id1}`);
}