import axios from 'axios';

const API_KEY = 'eb0a77846e0a670eabe21eb3';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
