import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://chatapp-v2-0r6l.onrender.com/api",
  withCredentials: true,
});
