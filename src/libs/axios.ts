// "use server";
// "use client";
import axios from "axios";
import { getCookie } from "cookies-next";
import { signOut } from "next-auth/react";
// import { cookies } from 'next/headers';
const API_HOST =
    process.env.BACKEND_API_HOST ??
    process.env.NEXT_PUBLIC_API_HOST ??
    process.env.API_HOST;
console.log({ API_HOST });
const axiosInstance = axios.create({
    baseURL: `${API_HOST}`,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getCookie("access_token");
        // const token = cookies().get('access_token')?.value;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.data?.statusCode === 401) {
            console.log({ error });
            signOut();
            return Promise.reject(new Error("Unauthorized"));
        }
        return error;
    }
);

export default axiosInstance;
