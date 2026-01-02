import axios from 'axios';

const API_URL = 'http://localhost:6969/api';

export const fetchProducts = async () => {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
};