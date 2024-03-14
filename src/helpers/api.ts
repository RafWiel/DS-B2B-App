import axios from 'axios';
import { config } from '../config/config.ts';

const api = axios.create({
    baseURL: `${config.API_URL}`,        
});

// api.interceptors.request.use((request) => {
//   console.log('interceptors.request');
//   return request;
// });

// api.interceptors.response.use((response) => response, (error) => {
//   // console.log('interceptors.response error: ', error);
//   router.replace({ name: 'Login' });
//   return error;
// });


export default api;

// I would suggest doing the following:

// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'http://localhost:5000',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   transformRequest: [
//     (data) => {
//       return JSON.stringify(data);
//     },
//   ],
//   transformResponse: [
//     (data) => {
//       return JSON.parse(data);
//     },
//   ],
// });

// import store from '../store'

// const listener = () => {
//   const token = store.getState().token
//   api.defaults.headers.common['Authorization'] = token;
// }

// store.subscribe(listener)

// export default api;
