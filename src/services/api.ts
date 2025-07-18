import axios from 'axios';

// Base URL - set explicitly to make sure we're connecting to the backend
const API_BASE_URL = 'http://localhost:5000/api';

// Configure axios
axios.defaults.baseURL = API_BASE_URL;

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return axios.post('/auth/login', { email, password });
  },
  getUser: async () => {
    return axios.get('/auth/me');
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    return axios.put('/auth/password', { currentPassword, newPassword });
  },
};

// Links API
export const linksAPI = {
  getLinks: async () => {
    return axios.get('/links');
  },
  getAdminLinks: async () => {
    return axios.get('/links/admin');
  },
  getLink: async (id: number) => {
    return axios.get(`/links/${id}`);
  },
  createLink: async (linkData: any) => {
    return axios.post('/links', linkData);
  },
  updateLink: async (id: number, linkData: any) => {
    return axios.put(`/links/${id}`, linkData);
  },
  deleteLink: async (id: number) => {
    return axios.delete(`/links/${id}`);
  },
  updateLinkOrder: async (linkIds: number[]) => {
    return axios.put('/links/order/update', { linkIds });
  },
};

// Profile API
export const profileAPI = {
  getProfile: async () => {
    return axios.get('/profile');
  },
  updateProfile: async (profileData: any) => {
    return axios.put('/profile', profileData);
  },
  uploadProfileImage: async (formData: FormData) => {
    return axios.post('/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default {
  auth: authAPI,
  links: linksAPI,
  profile: profileAPI,
};
