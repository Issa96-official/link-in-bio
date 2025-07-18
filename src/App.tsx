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

function App() {
  const [theme, setTheme] = useState('light');
  
  // Fetch the initial theme from the profile
  useEffect(() => {
    const fetchProfileTheme = async () => {
      try {
        const response = await profileAPI.getProfile();
        if (response.data && response.data.theme) {
          setTheme(response.data.theme);
        }
      } catch (error) {
        console.error('Failed to fetch profile theme:', error);
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
                  <LinkList />
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
