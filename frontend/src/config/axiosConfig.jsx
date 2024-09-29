import axios from 'axios';

axios.defaults.withCredentials = true;

// Optionally set the base URL if you have a consistent endpoint
axios.defaults.baseURL = 'http://localhost:4000/';

export default axios;
