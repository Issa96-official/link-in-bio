import { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { FaLink, FaUser, FaSignOutAlt, FaCog, FaEye, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { AuthContext } from '../../contexts/AuthContext';
import { linksAPI, profileAPI } from '../../services/api';
import LinkForm from '../../components/admin/LinkForm';
import ProfileForm from '../../components/admin/ProfileForm';
import PasswordChangeForm from '../../components/admin/PasswordChangeForm';
import '../../styles/admin/Dashboard.scss';

interface Link {
  id: number;
  title: string;
  url: string;
  icon: string;
  color: string;
  order_num: number;
  active: boolean;
}

interface Profile {
  id: number;
  name: string;
  bio: string;
  image_path: string;
  theme: string;
}

const Dashboard = () => {
  const { isAuthenticated, loading, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('links');
  const [links, setLinks] = useState<Link[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linksRes, profileRes] = await Promise.all([
          linksAPI.getAdminLinks(),
          profileAPI.getProfile()
        ]);
        
        setLinks(linksRes.data);
        setProfile(profileRes.data);
        setDashboardLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setDashboardLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  // Refresh data after updates
  const refreshData = async () => {
    setDashboardLoading(true);
    try {
      const [linksRes, profileRes] = await Promise.all([
        linksAPI.getAdminLinks(),
        profileAPI.getProfile()
      ]);
      
      setLinks(linksRes.data);
      setProfile(profileRes.data);
    } catch (err) {
      setError('Failed to refresh data');
    } finally {
      setDashboardLoading(false);
    }
  };

  // Handle link edit
  const handleEditLink = (id: number) => {
    setEditingLinkId(id);
    setShowLinkForm(true);
  };

  // Handle link delete
  const handleDeleteLink = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      try {
        await linksAPI.deleteLink(id);
        await refreshData();
      } catch (err) {
        setError('Failed to delete link');
      }
    }
  };

  // Handle link toggle active state
  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      await linksAPI.updateLink(id, { active: !currentActive });
      await refreshData();
    } catch (err) {
      setError('Failed to update link');
    }
  };

  // Handle add new link
  const handleAddLink = () => {
    setEditingLinkId(null);
    setShowLinkForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowLinkForm(false);
    setEditingLinkId(null);
  };

  // Redirect if not authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/admin/login" />;
  }

  if (loading || dashboardLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'links' ? 'active' : ''}`}
            onClick={() => setActiveTab('links')}
          >
            <FaLink /> Links
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profile
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FaCog /> Settings
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <Link to="/" className="view-site" target="_blank">
            <FaEye /> View Site
          </Link>
          <button className="logout-button" onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
      
      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        
        {activeTab === 'links' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Manage Links</h2>
              <button className="add-button" onClick={handleAddLink}>
                <FaPlus /> Add New Link
              </button>
            </div>
            
            <div className="links-list">
              {links.length === 0 ? (
                <p>No links found. Add your first link!</p>
              ) : (
                links.map((link) => (
                  <div key={link.id} className="link-item">
                    <div className="link-info">
                      <span className="link-icon" style={{ backgroundColor: link.color }}>
                        {/* This is just a placeholder - would need to dynamically render the actual icon */}
                        <i className={link.icon}></i>
                      </span>
                      <div className="link-details">
                        <h3>{link.title}</h3>
                        <p>{link.url}</p>
                      </div>
                    </div>
                    <div className="link-actions">
                      <button 
                        className="edit-button"
                        onClick={() => handleEditLink(link.id)}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeleteLink(link.id)}
                      >
                        <FaTrash /> Delete
                      </button>
                      <label className="toggle">
                        <input 
                          type="checkbox" 
                          checked={link.active} 
                          onChange={() => handleToggleActive(link.id, link.active)}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {showLinkForm && (
              <LinkForm 
                linkId={editingLinkId !== null ? editingLinkId : undefined} 
                onClose={handleFormClose}
                onSuccess={refreshData}
              />
            )}
          </div>
        )}
        
        {activeTab === 'profile' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Edit Profile</h2>
            </div>
            
            {profile && (
              <ProfileForm onSuccess={refreshData} />
            )}
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Account Settings</h2>
            </div>
            
            <PasswordChangeForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
