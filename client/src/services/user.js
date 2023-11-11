import axios from "axios";

export const userList = async (authtoken) => {
    return await axios.get('http://localhost:5000/user', {
        headers: {
            authtoken
        }
    });
}

export const removeUser = async (authtoken, id) => {
    return await axios.delete('http://localhost:5000/user/' + id, {
        headers: {
            authtoken
        }
    });
}

export const statusBlacklisUser = async (authtoken, value) => {
    return await axios.post('http://localhost:5000/change-status', value, {
        headers: {
            authtoken
        }
    });
}

export const statusVerify = async (authtoken, id, value) => {
    return await axios.post('http://localhost:5000/verify-user/' + id, value, {
        headers: {
            authtoken
        }
    });
}

export const profileUser = async (authtoken, id) => {
    return await axios.get("http://localhost:5000/profile-user/" + id, {
        headers: {
            authtoken
        }
    });
}

export const loadPhoto = async (authtoken, id) => {
    return await axios.get("http://localhost:5000/profile-photo/" + id, {
        headers: {
            authtoken,
        },
    });
};

export const profileEdit = async (id, data) => {
    return await axios.put("http://localhost:5000/profile-edit/" + id, data);
};
