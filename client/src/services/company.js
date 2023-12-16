import axios from "axios";
const baseURL = import.meta.env.VITE_API;

export const createCompany = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/createcompany`, data, {
        headers: {
            authtoken
        }
    });
}

export const deleteCompany = async (authtoken, data) => {
    return await axios.post(`${baseURL}/api/deletecompany`, data, {
        headers: {
            authtoken
        }
    });
}

export const companyList = async (authtoken, id) => {
    return await axios.get(`${baseURL}/api/companylist/` + id, {
        headers: {
            authtoken
        }
    });
}

export const companyDescrip = async (authtoken, id) => {
    return await axios.get(`${baseURL}/api/companydescrip/` + id, {
        headers: {
            authtoken
        }
    });
}

