import express from 'express';
import { check, validationResult } from 'express-validator';
import { login, getUserInfo, changePassword } from '../controllers/auth.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, login);

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', auth, getUserInfo);

// @route   PUT /api/auth/password
// @desc    Change user password
// @access  Private
router.put('/password', [
  auth,
  check('currentPassword', 'Current password is required').exists(),
  check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, changePassword);

export default router;
