import axios from "axios";

// Add a request interceptor
axios.interceptors.request.use(
   config => {
       const token = localStorage.getItem('token');
       if (token) {
           config.headers['Authorization'] = 'Bearer ' + token;
       }
       // config.headers['Content-Type'] = 'application/json';
       return config;
   },
   error => {
       Promise.reject(error)
   });



//Add a response interceptor

axios.interceptors.response.use((response) => {
    return response;
}, function (error) {
    // Do something with response error
    if (error.response.status === 401) {
        console.log('unauthorized, logging out ...');
        localStorage.clear();
        window.location.href ='/';
    }
    return Promise.reject(error.response);
});