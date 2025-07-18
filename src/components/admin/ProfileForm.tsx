import React, { useState, useEffect, useRef } from 'react';
import { FaUser, FaUpload } from 'react-icons/fa';
import { profileAPI } from '../../services/api';
import '../../styles/admin/ProfileForm.scss';

interface ProfileFormProps {
  onSuccess: () => void;
}

interface ProfileData {
  id?: number;
  name: string;
  bio: string;
  image_path: string;
  theme: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    bio: '',
    image_path: '',
    theme: 'light'
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        setFormData(res.data);
        
        // Set initial image preview with proper URL
        if (res.data.image_path) {
          setImagePreview(
            res.data.image_path.startsWith('http') 
              ? res.data.image_path 
              : `http://localhost:5000${res.data.image_path}`
          );
        }
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSaving(true);

    try {
      // First update profile data
      const profileResponse = await profileAPI.updateProfile(formData);
      console.log('Profile update response:', profileResponse.data);
      
      // Then upload image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const imageResponse = await profileAPI.uploadProfileImage(formData);
        console.log('Image upload response:', imageResponse.data);
        
        // Update image preview with the new image path
        if (imageResponse.data && imageResponse.data.image_path) {
          setImagePreview(
            imageResponse.data.image_path.startsWith('http')
              ? imageResponse.data.image_path
              : `http://localhost:5000${imageResponse.data.image_path}`
          );
        }
      }
      
      // Fetch the updated profile to ensure we have the latest data
      const updatedProfileResponse = await profileAPI.getProfile();
      setFormData(updatedProfileResponse.data);
      
      setSuccessMsg('Profile updated successfully');
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="profile-form-loading">Loading profile data...</div>;
  }

  return (
    <div className="profile-form-container">
      {error && <div className="form-error">{error}</div>}
      {successMsg && <div className="form-success">{successMsg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="profile-image-section">
          <div className="profile-image-container" onClick={handleImageClick}>
            {imagePreview ? (
              <img 
                src={imagePreview.startsWith('data:') ? imagePreview : `http://localhost:5000${imagePreview}`}
                alt="Profile" 
                className="profile-image-preview"
              />
            ) : (
              <div className="profile-image-placeholder">
                <FaUser />
              </div>
            )}
            <div className="profile-image-overlay">
              <FaUpload />
              <span>Change Image</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="A short description about you"
            rows={4}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="theme">Default Theme</label>
          <select
            id="theme"
            name="theme"
            value={formData.theme}
            onChange={handleChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <button type="submit" className="save-button" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
