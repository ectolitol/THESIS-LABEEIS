import axios from 'axios';

// Set the base URL dynamically based on the hostname
axios.defaults.baseURL = window.location.hostname === 'localhost' 
  ? 'http://13.212.191.232:4000/' 
  : ''; 
// 47.129.7.196
// Ensure credentials (cookies, auth headers) are sent with each request if necessary
axios.defaults.withCredentials = true;

export const imageBaseURL = window.location.hostname === 'localhost' 
  ? 'http://13.212.191.232:4000' 
  : '';

//   axios.defaults.baseURL = window.location.hostname === 'localhost' 
//   ? 'http://localhost:4000/' 
//   : ''; 
// // 47.129.7.196
// // Ensure credentials (cookies, auth headers) are sent with each request if necessary
// axios.defaults.withCredentials = true;

// export const imageBaseURL = window.location.hostname === 'localhost' 
//   ? 'http://localhost:4000' 
//   : '';

export default axios;
 