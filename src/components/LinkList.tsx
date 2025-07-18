import { useState, useEffect } from 'react'
import { FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaEnvelope, FaGlobe, FaLinkedin, FaSpinner } from 'react-icons/fa'
import '../styles/LinkList.new.scss'
import { linksAPI } from '../services/api'

interface LinkItem {
  id: number
  title: string
  url: string
  icon: string
  color: string
  active: boolean
  position: number
}

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'FaInstagram': return <FaInstagram />
    case 'FaTwitter': return <FaTwitter />
    case 'FaYoutube': return <FaYoutube />
    case 'FaTiktok': return <FaTiktok />
    case 'FaEnvelope': return <FaEnvelope />
    case 'FaGlobe': return <FaGlobe />
    case 'FaLinkedin': return <FaLinkedin />
    default: return <FaGlobe />
  }
}

const LinkList = () => {
  const [links, setLinks] = useState<LinkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true)
        const response = await linksAPI.getLinks()
        setLinks(response.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching links:', err)
        setError('Failed to load links. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchLinks()
  }, [])

  return (
    <div className="link-list">
      {loading ? (
        <div className="loading-spinner">
          <FaSpinner className="spin" />
          <p>Loading links...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        links
          .filter(link => link.active)
          .sort((a, b) => a.position - b.position)
          .map((link) => (
            <a
              key={link.id}
              href={link.url}
              className="link-item"
              target="_blank"
              rel="noopener noreferrer"
              style={{'--link-icon-color': link.color} as React.CSSProperties}
            >
              <span className="link-icon">{getIconComponent(link.icon)}</span>
              <span className="link-title">{link.title}</span>
            </a>
          ))
      )}
    </div>
  )
}

export default LinkList
