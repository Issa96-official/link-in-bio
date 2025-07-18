import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import { linksAPI } from '../../services/api';
import '../../styles/admin/LinkForm.scss';

const LinkForm = ({ linkId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    icon: 'FaLink',
    color: '#7C41F5',
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  // List of available icons
  const availableIcons = [
    { name: 'FaLink', label: 'Link' },
    { name: 'FaInstagram', label: 'Instagram' },
    { name: 'FaTwitter', label: 'Twitter' },
    { name: 'FaYoutube', label: 'YouTube' },
    { name: 'FaTiktok', label: 'TikTok' },
    { name: 'FaLinkedin', label: 'LinkedIn' },
    { name: 'FaFacebook', label: 'Facebook' },
    { name: 'FaGithub', label: 'GitHub' },
    { name: 'FaEnvelope', label: 'Email' },
    { name: 'FaGlobe', label: 'Website' },
    { name: 'FaWhatsapp', label: 'WhatsApp' },
    { name: 'FaSpotify', label: 'Spotify' },
    { name: 'FaTwitch', label: 'Twitch' },
    { name: 'FaDiscord', label: 'Discord' },
    { name: 'FaReddit', label: 'Reddit' },
    { name: 'FaPinterest', label: 'Pinterest' },
    { name: 'FaTelegram', label: 'Telegram' }
  ];

  // Load link data if editing
  useEffect(() => {
    const fetchLink = async () => {
      if (linkId) {
        setIsEdit(true);
        setLoading(true);
        try {
          const res = await linksAPI.getLink(linkId);
          setFormData(res.data);
        } catch (err) {
          setError('Failed to load link data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchLink();
  }, [linkId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: e.target.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleColorChange = (color) => {
    setFormData({
      ...formData,
      color
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit && linkId) {
        await linksAPI.updateLink(linkId, formData);
      } else {
        await linksAPI.createLink(formData);
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save link');
    } finally {
      setLoading(false);
    }
  };

  // Predefined colors
  const predefinedColors = [
    '#7C41F5', // Purple
    '#3C98F5', // Blue
    '#2ECC71', // Green
    '#F5D93C', // Yellow
    '#FF6347', // Tomato
    '#E74C3C', // Red
    '#E1306C', // Instagram
    '#1DA1F2', // Twitter
    '#FF0000', // YouTube
    '#000000', // Black
    '#0077B5', // LinkedIn
    '#3B5998'  // Facebook
  ];

  if (loading && isEdit) {
    return <div className="link-form-loading">Loading...</div>;
  }

  return (
    <div className="link-form-overlay">
      <div className="link-form-container">
        <div className="link-form-header">
          <h2>{isEdit ? 'Edit Link' : 'Add New Link'}</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Link Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. My Instagram"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="url">URL</label>
            <input
              type="url"
              id="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://example.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="icon">Icon</label>
            <select
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              required
            >
              {availableIcons.map((icon) => (
                <option key={icon.name} value={icon.name}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Color</label>
            <div className="color-picker">
              {predefinedColors.map((color) => (
                <div
                  key={color}
                  className={`color-option ${formData.color === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
              
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="custom-color-input"
              />
            </div>
          </div>

          {isEdit && (
            <div className="form-group checkbox-group">
              <label htmlFor="active">Active</label>
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Update Link' : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LinkForm;
