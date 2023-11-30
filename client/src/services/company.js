import axios from "axios";

export const createCompany = async (authtoken, data) => {
    return await axios.post('http://localhost:5000/createcompany', data, {
        headers: {
            authtoken
        }
    });
}

export const deleteCompany = async (authtoken, data) => {
    return await axios.post('http://localhost:5000/deletecompany', data, {
        headers: {
            authtoken
        }
    });
}

export const companyList = async (authtoken, id) => {
    return await axios.get('http://localhost:5000/companylist/' + id, {
        headers: {
            authtoken
        }
    });
}

export const companyDescrip = async (authtoken, id) => {
    return await axios.get('http://localhost:5000/companydescrip/' + id, {
        headers: {
            authtoken
        }
    });
}

