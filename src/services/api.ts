import axios from 'axios';

// Base URL - set explicitly to make sure we're connecting to the backend
// För GitHub Pages, skapa mockdata om vi är i produktion
const isGitHubPages = window.location.hostname.includes('github.io') || 
                      window.location.hostname.includes('issa96-official');
const isDevelopment = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && !isGitHubPages;

// Logga miljöinformation för felsökning
console.log('Current hostname:', window.location.hostname);
console.log('Is development environment:', isDevelopment);
console.log('Is GitHub Pages:', isGitHubPages);

// Konfigurera API URL - för GitHub Pages demo, använd mockdata
const API_BASE_URL = !isGitHubPages && isDevelopment
  ? 'http://localhost:5000/api'
  : ''; // Tom sträng för att använda relativa sökvägar med mockdata

// Configure axios
axios.defaults.baseURL = API_BASE_URL;

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

// Använd en annan metod för mockdata som inte kräver att vi ersätter axios.request
// Detta löser TypeScript-kompatibilitetsproblem
if (!isDevelopment || isGitHubPages) {
  console.log('Setting up mock data for production or GitHub Pages environment');
  
  // Intercepta alla request och gör om dem till mockdata om vi är på GitHub Pages
  axios.interceptors.request.use((config) => {
    if (isDevelopment && !isGitHubPages) {
      console.log('Using real API endpoint');
      return config;
    }
    
    console.log('Intercepting request for mockdata:', config.url);
    // Markera requesten för mockdata
    config.headers = config.headers || {};
    config.headers['x-mock-data'] = 'true';
    
    return config;
  });
  
  // Lägg till en response interceptor för att simulera backend
  axios.interceptors.response.use(
    (response) => {
      console.log('Response success:', response.config.url);
      return response;
    },
    (error) => {
      console.log('Response error for URL:', error.config?.url);
      console.log('Is mockdata request:', error.config?.headers?.['x-mock-data'] === 'true');
      
      // Om detta är en mockdata-request (från GitHub Pages), returnera mockdata
      if (error.config?.headers?.['x-mock-data'] === 'true') {
        const url = error.config.url || '';
        const method = error.config.method || '';
        
        console.log('Providing mock data for:', method, url);
        
        // GET anrop för links
        if (method === 'get' && url.includes('/links')) {
          if (url.includes('/admin')) {
            return Promise.resolve({ data: mockLinks });
          } else {
            return Promise.resolve({ data: mockLinks });
          }
        }
        
        // GET anrop för ett specifikt link ID
        if (method === 'get' && url.match(/\/links\/\d+/)) {
          const id = parseInt(url.split('/').pop() || '0');
          const link = mockLinks.find(l => l.id === id);
          return Promise.resolve({ data: link || {} });
        }
        
        // POST för nya länkar
        if (method === 'post' && url.includes('/links')) {
          return Promise.resolve({ 
            data: { 
              id: 5, 
              ...JSON.parse(error.config.data || '{}'), 
              displayOrder: mockLinks.length + 1 
            } 
          });
        }
        
        // PUT för att uppdatera länkar
        if (method === 'put' && url.match(/\/links\/\d+/)) {
          return Promise.resolve({ data: { ...JSON.parse(error.config.data || '{}') } });
        }
        
        // DELETE för länkar
        if (method === 'delete' && url.match(/\/links\/\d+/)) {
          return Promise.resolve({ data: { success: true } });
        }
        
        // GET anrop för profile
        if (method === 'get' && url.includes('/profile')) {
          return Promise.resolve({ data: mockProfile });
        }
        
        // PUT för att uppdatera profile
        if (method === 'put' && url.includes('/profile')) {
          return Promise.resolve({ 
            data: { ...mockProfile, ...JSON.parse(error.config.data || '{}') }
          });
        }
        
        // POST för profilbild
        if (method === 'post' && url.includes('/profile/image')) {
          return Promise.resolve({ 
            data: {
              success: true, 
              image: 'https://github.com/Issa96-official.png' 
            }
          });
        }
        
        // GET för auth/me
        if (method === 'get' && url.includes('/auth/me')) {
          return Promise.resolve({ data: mockUser });
        }
        
        // POST för login
        if (method === 'post' && url.includes('/auth/login')) {
          return Promise.resolve({ 
            data: { 
              token: 'mock-jwt-token-for-demo-purposes-only',
              user: mockUser
            }
          });
        }
        
        // PUT för password change
        if (method === 'put' && url.includes('/auth/password')) {
          return Promise.resolve({ data: { success: true } });
        }
      }
      
      // Om detta inte är en mockdata-request, fortsätt med error
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
