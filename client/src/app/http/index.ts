import axios, { AxiosRequestConfig } from "axios";
import { AuthResponse } from "../types/AuthorizationRes";
import { ApiRoutes } from "../types/ApiRoutes";

export const API_URL = import.meta.env.VITE_API_URL;

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export const $unathoriedAPI = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
  if (config && config.headers) {
    config.headers["Access-Control-Allow-Origin"] = "*";
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
    return config;
  }
  return config;
});

$api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true;
      try {
        const response = await axios.get<AuthResponse>(
          API_URL + ApiRoutes.RefreshToken,
          {
            withCredentials: true,
          }
        );
        localStorage.setItem("token", response.data.accessToken);
        return $api.request(originalRequest);
      } catch (error) {
        console.log("Unauthorized");
      }
    }
    throw error;
  }
);

export default $api;
