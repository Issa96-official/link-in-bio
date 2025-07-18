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

// Mockdata för GitHub Pages demo
const mockLinks = [
  { id: 1, title: 'Min webbplats', url: 'https://issa96-official.github.io/link-in-bio', icon: 'globe', displayOrder: 1 },
  { id: 2, title: 'GitHub', url: 'https://github.com/Issa96-official', icon: 'github', displayOrder: 2 },
  { id: 3, title: 'LinkedIn', url: 'https://linkedin.com/in/issa-alissa', icon: 'linkedin', displayOrder: 3 },
  { id: 4, title: 'Twitter', url: 'https://twitter.com/issaalissa', icon: 'twitter', displayOrder: 4 },
];

const mockProfile = {
  name: 'Issa Alissa',
  title: 'Frontend Developer',
  bio: 'Passionate about creating beautiful web experiences',
  theme: 'light',
  image: 'https://github.com/Issa96-official.png',
};

const mockUser = {
  id: 1,
  email: 'demo@example.com',
  name: 'Issa Alissa',
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

// Om vi är i produktion, lägg till en respons-interceptor för att direkt använda mockdata
if (!isDevelopment) {
  // Ersätt hela axios.request metoden för mockdata
  const originalRequest = axios.request;
  
  axios.request = function(config) {
    // Kontrollera vilken typ av request det är och returnera mockdata
    const url = config.url || '';
    
    console.log('Mock API call:', config.method, url);
    
    // GET anrop för links
    if (config.method === 'get' && url.includes('/links')) {
      if (url.includes('/admin')) {
        return Promise.resolve(createMockResponse(mockLinks));
      } else {
        return Promise.resolve(createMockResponse(mockLinks));
      }
    }
    
    // GET anrop för ett specifikt link ID
    if (config.method === 'get' && url.match(/\/links\/\d+/)) {
      const id = parseInt(url.split('/').pop() || '0');
      const link = mockLinks.find(l => l.id === id);
      return Promise.resolve(createMockResponse(link || {}));
    }
    
    // POST för nya länkar
    if (config.method === 'post' && url.includes('/links')) {
      return Promise.resolve(createMockResponse({ id: 5, ...config.data, displayOrder: mockLinks.length + 1 }));
    }
    
    // PUT för att uppdatera länkar
    if (config.method === 'put' && url.match(/\/links\/\d+/)) {
      return Promise.resolve(createMockResponse({ ...config.data }));
    }
    
    // DELETE för länkar
    if (config.method === 'delete' && url.match(/\/links\/\d+/)) {
      return Promise.resolve(createMockResponse({ success: true }));
    }
    
    // GET anrop för profile
    if (config.method === 'get' && url.includes('/profile')) {
      return Promise.resolve(createMockResponse(mockProfile));
    }
    
    // PUT för att uppdatera profile
    if (config.method === 'put' && url.includes('/profile')) {
      return Promise.resolve(createMockResponse({ ...mockProfile, ...config.data }));
    }
    
    // POST för profilbild
    if (config.method === 'post' && url.includes('/profile/image')) {
      return Promise.resolve(createMockResponse({ 
        success: true, 
        image: 'https://github.com/Issa96-official.png' 
      }));
    }
    
    // GET för auth/me
    if (config.method === 'get' && url.includes('/auth/me')) {
      return Promise.resolve(createMockResponse(mockUser));
    }
    
    // POST för login
    if (config.method === 'post' && url.includes('/auth/login')) {
      return Promise.resolve(createMockResponse({ 
        token: 'mock-jwt-token-for-demo-purposes-only',
        user: mockUser
      }));
    }
    
    // PUT för password change
    if (config.method === 'put' && url.includes('/auth/password')) {
      return Promise.resolve(createMockResponse({ success: true }));
    }
    
    // För alla andra anrop, använd original axios
    return originalRequest(config);
  };
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
