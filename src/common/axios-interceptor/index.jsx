import axios from "axios";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const api = axios.create({
    baseURL: "http://localhost:3001", 
    withCredentials: true, // Ensure cookies are sent with requests
});

// Request interceptor to include the access token in the header
api.interceptors.request.use(
    (config) => {
        const token = cookies.get("token"); // Access token from cookies

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle expired access token and refresh it
api.interceptors.response.use(
    (response) => {
        // If the backend sends a new access token, store it in cookies
        if (response.data.access_token) {
            cookies.set("token", response.data.access_token, { path: "/", sameSite: "lax" });
        }

        // If the backend sends a new refresh token, store it in cookies (important for refreshing)
        if (response.data.refresh_token) {
            cookies.set("refresh_token", response.data.refresh_token, { path: "/", sameSite: "lax" });
        }
        
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

       
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                
                const refresh_token = cookies.get("refresh_token");

                if (!refresh_token) {
                    throw new Error("Refresh token missing");
                }

                
                const response = await axios.post("http://localhost:3001/users/refresh-token", {
                    refresh_token,
                });

                if (response.data.access_token) {
                    
                    cookies.set("token", response.data.access_token, { path: "/", sameSite: "lax" });

                    
                    if (response.data.refresh_token) {
                        cookies.set("refresh_token", response.data.refresh_token, { path: "/", sameSite: "lax" });
                    }

                    // // Reattempt the original request with the new access token
                    // originalRequest.headers["Authorization"] = `Bearer ${response.data.access_token}`;
                    // return axios(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh token expired or invalid:", refreshError);

                
                cookies.remove("token");
                cookies.remove("refresh_token");
                window.location.href = "/login"; 
            }
        }

        return Promise.reject(error);
    }
);
