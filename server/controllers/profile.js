import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbGet, dbRun } from '../db/database.js';

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get profile
export const getProfile = async (req, res) => {
  try {
    const profile = await dbGet('SELECT * FROM profile WHERE id = 1');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (err) {
    console.error('Get profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, theme } = req.body;
    
    // Check if profile exists
    const profile = await dbGet('SELECT * FROM profile WHERE id = 1');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    await dbRun(
      'UPDATE profile SET name = ?, bio = ?, theme = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [
        name || profile.name,
        bio || profile.bio,
        theme || profile.theme
      ]
    );
    
    const updatedProfile = await dbGet('SELECT * FROM profile WHERE id = 1');
    res.json(updatedProfile);
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file uploaded in request:', req.body);
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    console.log('File upload request received:', {
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    // Check if profile exists
    const profile = await dbGet('SELECT * FROM profile WHERE id = 1');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Remove old image if it's not the default
    if (profile.image_path && profile.image_path !== '/profile.jpg') {
      const oldImagePath = path.join(__dirname, '../../uploads', path.basename(profile.image_path));
      console.log('Checking for old image at:', oldImagePath);
      if (fs.existsSync(oldImagePath)) {
        console.log('Removing old image:', oldImagePath);
        fs.unlinkSync(oldImagePath);
      }
    }
    
    // Set new image path
    const imagePath = `/uploads/${req.file.filename}`;
    console.log('Setting new image path:', imagePath);
    
    await dbRun(
      'UPDATE profile SET image_path = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [imagePath]
    );
    
    const updatedProfile = await dbGet('SELECT * FROM profile WHERE id = 1');
    res.json(updatedProfile);
  } catch (err) {
    console.error('Upload profile image error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
