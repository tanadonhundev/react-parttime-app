import axios from "axios";

export const registerUser = async (data) => {
    return await axios.post('http://localhost:5000/register', data);
}


export const loginUser = async (data) => {
    return await axios.post('http://localhost:5000/login', data);
}


export const currentUser = async (authtoken) => {
    return await axios.post('http://localhost:5000/current-user', {}, {
        headers: {
            authtoken
        }
    });

}
