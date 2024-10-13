import axios from "axios";

// Set the base URL dynamically based on the environment
axios.defaults.baseURL =
  window.location.hostname === "localhost"
    ? "http://13.212.191.232:4000/" // Development (local)
    : "http://13.212.191.232:4000/"; // Production (use the same base URL)

axios.defaults.withCredentials = true; // Ensure credentials (cookies, auth headers) are sent with each request if necessary

export const imageBaseURL =
  window.location.hostname === "localhost"
    ? "http://13.212.191.232:4000" // Development (local)
    : "http://13.212.191.232:4000"; // Production (same image base URL)

export default axios;