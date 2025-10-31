import axios, { AxiosError } from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

const API = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true, // send cookies (refresh token) with requests
});

// ---- Attach access token from localStorage to each request ----
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // update key if needed
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// ---- Refresh token logic ----

API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    const excludedUrls = [
      '/user/login',
      '/user/getOTP/signup',
      '/user/getOTP/login',
      '/user/signup',
      '/refresh',
    ];

    const normalizedUrl = (originalRequest.url || '').replace(/^\/?/, '/');

    if (
      error.response?.status === 401 &&
      !excludedUrls.includes(normalizedUrl) &&
      !(originalRequest as any)._retry
    ) {
      (originalRequest as any)._retry = true;

      try {
        const response = await axios.post(
          `${baseURL}refresh`,
          {},
          { withCredentials: true },
        );

        const newToken = response.data?.data.accessToken;

        if (newToken) {
          localStorage.setItem('accessToken', newToken);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };

          return axios(originalRequest); // or return API(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
