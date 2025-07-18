import axios from 'axios';

// Base URL - set explicitly to make sure we're connecting to the backend
// För GitHub Pages, skapa mockdata om vi är i produktion
const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Konfigurera API URL - för GitHub Pages demo, använd mockdata
const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5000/api'
  : ''; // Tom sträng för att använda relativa sökvägar med mockdata

// Configure axios
axios.defaults.baseURL = API_BASE_URL;

// För GitHub Pages, skapa mockdata för demo-syfte
const createMockResponse = (data: any) => {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };
};

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

// Om vi är i produktion, lägg till en respons-interceptor för att använda mockdata
if (!isDevelopment) {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Om det är ett GitHub Pages-demo, returnera mockdata
      console.log('Using mock data for GitHub Pages demo');
      
      // Hantera olika API-anrop med mockdata
      const url = error.config.url;
      
      if (url.includes('/links')) {
        return Promise.resolve(createMockResponse([
          { id: 1, title: 'Min webbplats', url: 'https://issa96-official.github.io', icon: 'globe', displayOrder: 1 },
          { id: 2, title: 'GitHub', url: 'https://github.com/Issa96-official', icon: 'github', displayOrder: 2 },
          { id: 3, title: 'LinkedIn', url: 'https://linkedin.com/in/issa-alissa', icon: 'linkedin', displayOrder: 3 },
          { id: 4, title: 'Twitter', url: 'https://twitter.com/issaalissa', icon: 'twitter', displayOrder: 4 },
        ]));
      }
      
      if (url.includes('/profile')) {
        return Promise.resolve(createMockResponse({
          name: 'Issa Alissa',
          title: 'Frontend Developer',
          bio: 'Passionate about creating beautiful web experiences',
          theme: 'light',
          image: 'https://github.com/Issa96-official.png',
        }));
      }
      
      if (url.includes('/auth/me')) {
        return Promise.resolve(createMockResponse({
          id: 1,
          email: 'demo@example.com',
          name: 'Issa Alissa',
        }));
      }
      
      // Fallback för andra anrop
      return Promise.reject(error);
    }
  );
}

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
