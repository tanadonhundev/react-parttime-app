import axios from "axios";
const baseURL = import.meta.env.VITE_API;

export const postWork = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/postwork`, data, {
        headers: {
            authtoken
        }
    });
}

export const workList = async (authtoken) => {
    return await axios.get(`${baseURL}/api/workList`, {
        headers: {
            authtoken
        }
    });
}

export const workDescrip = async (authtoken, id) => {
    return await axios.get(`${baseURL}/api/workList/` + id, {
        headers: {
            authtoken
        }
    });
}

export const workDescripList = async (authtoken, id) => {
    return await axios.get(`${baseURL}/api/workDescripList/` + id, {
        headers: {
            authtoken
        }
    });
}

export const applyWork = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/applyWork`, data, {
        headers: {
            authtoken
        }
    });
}

export const applyList = async (authtoken, id,) => {
    return await axios.get(`${baseURL}/api/applyList/` + id, {
        headers: {
            authtoken
        }
    });
}

export const ChangeEmploymentStatus = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/employmentstatus`, data, {
        headers: {
            authtoken
        }
    });
}

export const CancelWork = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/cancelwork`, data, {
        headers: {
            authtoken
        }
    });
}

