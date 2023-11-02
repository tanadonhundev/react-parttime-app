import axios from "axios";

export const postWork = async (authtoken, data) => {
    return await axios.post('http://localhost:5000/postwork', data, {
        headers: {
            authtoken
        }
    });
}

export const workList = async (authtoken) => {
    return await axios.get('http://localhost:5000/workList', {
        headers: {
            authtoken
        }
    });
}

export const workDescrip = async (authtoken, id) => {
    return await axios.get("http://localhost:5000/workList/" + id, {
        headers: {
            authtoken
        }
    });
}

export const workDescripList = async (authtoken, id) => {
    return await axios.get("http://localhost:5000/workDescripList/" + id, {
        headers: {
            authtoken
        }
    });
}

export const applyWork = async (authtoken, data) => {
    await axios.post('http://localhost:5000/applyWork', data, {
        headers: {
            authtoken
        }
    });
}
