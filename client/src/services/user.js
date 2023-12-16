import axios from "axios";
const baseURL = import.meta.env.VITE_API;

export const userList = async (authtoken) => {
    return await axios.get(`${baseURL}/api/user`, {
        headers: {
            authtoken
        }
    });
}

export const removeUser = async (authtoken, id) => {
    return await axios.delete(`${baseURL}/api/user/` + id, {
        headers: {
            authtoken
        }
    });
}

export const statusBlacklisUser = async (authtoken, value) => {
    return await axios.post(`${baseURL}/api/change-status`, value, {
        headers: {
            authtoken
        }
    });
}

export const statusVerify = async (authtoken, id, value) => {
    return await axios.post(`${baseURL}/api/verify-user/` + id, value, {
        headers: {
            authtoken
        }
    });
}

export const profileUser = async (authtoken, id) => {
    return await axios.get(`${baseURL}/api/profile-user/` + id, {
        headers: {
            authtoken
        }
    });
}

export const loadPhoto = async (authtoken, id) => {
    return await axios.get(`${baseURL}/api/profile-photo/` + id, {
        headers: {
            authtoken,
        },
    });
};

export const profileEdit = async (id, data) => {
    return await axios.put(`${baseURL}/api/profile-edit/` + id, data);
};
