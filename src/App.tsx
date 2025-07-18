import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LinkList from './components/LinkList';
import Footer from './components/Footer';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { profileAPI } from './services/api';
import './styles/App.scss';

// Debug info for troubleshooting MIME issues
console.log('App.tsx loaded');
console.log('Current URL:', window.location.href);
console.log('Base URL path:', import.meta.env.BASE_URL || '/');
console.log('GitHub Pages?', window.location.hostname.includes('github.io'));

function App() {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch the initial theme from the profile
  useEffect(() => {
    const fetchProfileTheme = async () => {
      try {
        console.log('Fetching profile theme...');
        setLoading(true);
        const response = await profileAPI.getProfile();
        console.log('Profile response:', response);
        if (response.data && response.data.theme) {
          setTheme(response.data.theme);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile theme:', error);
        setError('Failed to load profile. Using default theme.');
        setLoading(false);
      }
    };
    
    fetchProfileTheme();
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Optionally save the theme preference to the profile
    try {
      profileAPI.updateProfile({ theme: newTheme });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            <div className={`app ${theme}`}>
              <div className="container">
                <Header toggleTheme={toggleTheme} theme={theme} />
                <main>
                  {loading ? (
                    <div className="loading-indicator">Loading your links...</div>
                  ) : error ? (
                    <div className="error-message">{error}</div>
                  ) : (
                    <LinkList />
                  )}
                </main>
                <Footer />
              </div>
            </div>
          } 
        />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
