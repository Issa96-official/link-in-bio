import { useState, useEffect } from 'react'
import { FaSun, FaMoon, FaLock } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { profileAPI } from '../services/api'
import '../styles/Header.scss'

interface HeaderProps {
  toggleTheme: () => void
  theme: string
}

interface ProfileData {
  id?: number
  name: string
  bio: string
  image_path: string
  theme: string
}

const Header = ({ toggleTheme, theme }: HeaderProps) => {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile()
        setProfile(res.data)
      } catch (err) {
        console.error('Failed to load profile data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return (
    <header className="header">
      <div className="profile">
        {loading ? (
          <div className="loading-placeholder">Loading profile...</div>
        ) : (
          <>
            <img 
              src={profile?.image_path ? 
                profile.image_path.startsWith('http') ? 
                profile.image_path : 
                `http://localhost:5000${profile.image_path}` : 
                '/profile.jpg'} 
              alt="Profile" 
              className="profile-image" 
            />
            <h1>{profile?.name || 'Skappa'}</h1>
            <p>{profile?.bio || 'Connect with me on all platforms'}</p>
          </>
        )}
      </div>
      <div className="header-controls">
        <Link to="/admin/login" className="admin-login-btn" aria-label="Admin login">
          <FaLock />
          <span className="admin-tooltip">Admin</span>
        </Link>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>
    </header>
  )
}

export default Header
