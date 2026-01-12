import axios from 'axios';

const API_URL = 'http://localhost:8000/api/suppliers'; 

export const SupplierAPI = {
    getAll: async () => {
        const response = await axios.get(API_URL);
        return response.data;
    },
    create: async (data) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    },
    updateRating: async (uid, value) => {
        const response = await axios.put(`${API_URL}/${uid}/rating?value=${value}`);
        return response.data;
    },
    delete: async (uid) => {
        const response = await axios.delete(`${API_URL}/${uid}`);
        return response.data;
    }
};