import axios from "axios";

export const createWork = async (authtoken, data) => {
    return await axios.post('http://localhost:5000/creatework', data, {
        headers: {
            authtoken
        }
    });
}

export const companyList = async (authtoken, id) => {
    return await axios.get('http://localhost:5000/creatework/' + id, {
        headers: {
            authtoken
        }
    });
}

export const companyDescrip = async (authtoken, id) => {
    return await axios.get('http://localhost:5000/work-details/' + id, {
        headers: {
            authtoken
        }
    });
}

