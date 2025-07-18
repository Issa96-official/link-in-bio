import axios from 'axios';

// I utvecklingsmiljö använder vi Vite-proxy som är konfigurerad i vite.config.ts
// I produktionsmiljö används relativa URL:er eftersom backend och frontend körs från samma server

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
    return axios.post('/api/auth/login', { email, password });
  },
  getUser: async () => {
    return axios.get('/api/auth/me');
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    return axios.put('/api/auth/password', { currentPassword, newPassword });
  },
};

// Links API
export const linksAPI = {
  getLinks: async () => {
    return axios.get('/api/links');
  },
  getAdminLinks: async () => {
    return axios.get('/api/links/admin');
  },
  getLink: async (id: number) => {
    return axios.get(`/api/links/${id}`);
  },
  createLink: async (linkData: any) => {
    return axios.post('/api/links', linkData);
  },
  updateLink: async (id: number, linkData: any) => {
    return axios.put(`/api/links/${id}`, linkData);
  },
  deleteLink: async (id: number) => {
    return axios.delete(`/api/links/${id}`);
  },
  updateLinkOrder: async (linkIds: number[]) => {
    return axios.put('/api/links/order/update', { linkIds });
  },
};

// Profile API
export const profileAPI = {
  getProfile: async () => {
    return axios.get('/api/profile');
  },
  updateProfile: async (profileData: any) => {
    return axios.put('/api/profile', profileData);
  },
  uploadProfileImage: async (formData: FormData) => {
    return axios.post('/api/profile/image', formData, {
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
