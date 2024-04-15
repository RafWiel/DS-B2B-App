/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from 'axios';
//import axios, { AxiosError } from 'axios';
import { config } from '../config/config.ts';
//import { ILoginResponse } from '../interfaces/ILoginResponse.ts';
//import { useAuth } from './useAuth.ts';

export const useApi = () => {
    //const auth = useAuth();

    const api = axios.create({
        baseURL: `${config.API_URL}`, 
        //headers: {
        //    'Authorization': `bearer ${auth.user.token}`,
        //},               
    });

    // api.interceptors.request.use(async (request) => {
    //     if (request?.url === '/auth/login' ||
    //         request?.url === '/auth/refresh') {                
    //         return request;
    //     }

    //     if (!auth.user.isAccessToken && auth.user.isRefreshToken) {
    //         console.log('TOKEN EXPIRED');

    //         const token = await fetchToken(request.url!);
    //             if (!token) {            
    //                 return request; //Promise.reject(request);
    //             }
                  
    //             auth.loginUser(token);            
    //             request.headers['Authorization'] = `bearer ${token.token}`;
    //     }
                    
    //     return request;
    // });
      
    // api.interceptors.response.use((response) => {
    //         //console.log('interceptors.response', response);
    //         return response;
    //     },
    //     async (error: AxiosError) => {
    //         const request = error.config;
    
    //         //console.log('interceptors.response.error status', error.response?.status);
    //         //console.log('originalRequest._retry', originalRequest._retry);
    //         //console.log('interceptors.response.error', error);

    //         //prevent infinite loop
    //         if (request?.url === '/auth/refresh') {                
    //             return Promise.reject(error);
    //         }
    
    //         if (error.response?.status === 401 && request) {                      
    //             console.log('401 GET TOKEN', request.url);                
                
    //             const token = await fetchToken(request.url!);
    //             if (!token) {            
    //                 return Promise.reject(error);
    //             }
                  
    //             auth.loginUser(token);            
    //             request.headers['Authorization'] = `bearer ${token.token}`;
                                                                
    //             return api(request);
    //         }
    
    //         return Promise.reject(error);
    //     }
    // );
    
    // const fetchToken = async (url: string) => {
    //     try {        
    //         const res = await api.post('/auth/refresh', null, {
    //             withCredentials: true,
    //         });
    
    //         //console.log("refresh token OK", url);
    //         //console.log("refresh token", res.data);
            
    //         return res.data as ILoginResponse;
    //     } 
    //     catch (error) {
    //         const axiosError = error as AxiosError;

    //         if (axiosError.response?.status === 401) {
    //             console.log('refresh token error. Logout user', url);
                
    //             auth.logoutUser();
    //         }            
    //     }
    // };
 
    return api;
}

