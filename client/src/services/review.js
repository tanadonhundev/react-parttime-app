import axios from "axios";

export const reviewEmployee = async (authtoken, data) => {
    return await axios.post('http://localhost:5000/reviewemployee', data, {
        headers: {
            authtoken
        }
    });
}

export const reviewOwner = async (authtoken, data) => {
    return await axios.post('http://localhost:5000/reviewowner', data, {
        headers: {
            authtoken
        }
    });
}