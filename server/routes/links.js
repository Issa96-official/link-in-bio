import express from 'express';
import { check, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';
import {
  getAllLinks,
  getAllLinksAdmin,
  getLinkById,
  createLink,
  updateLink,
  deleteLink,
  updateLinkOrder
} from '../controllers/links.js';

const router = express.Router();

// @route   GET /api/links
// @desc    Get all active links
// @access  Public
router.get('/', getAllLinks);

// @route   GET /api/links/admin
// @desc    Get all links (including inactive) for admin
// @access  Private
router.get('/admin', auth, getAllLinksAdmin);

// @route   GET /api/links/:id
// @desc    Get link by ID
// @access  Private
router.get('/:id', auth, getLinkById);

// @route   POST /api/links
// @desc    Create a new link
// @access  Private
router.post('/', [
  auth,
  check('title', 'Title is required').not().isEmpty(),
  check('url', 'URL is required').not().isEmpty(),
  check('icon', 'Icon is required').not().isEmpty(),
  check('color', 'Color should be a valid hex color').optional().isHexColor()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, createLink);

// @route   PUT /api/links/:id
// @desc    Update a link
// @access  Private
router.put('/:id', [
  auth,
  check('title', 'Title must be a string').optional().isString(),
  check('url', 'URL must be a string').optional().isString(),
  check('icon', 'Icon must be a string').optional().isString(),
  check('color', 'Color should be a valid hex color').optional().isHexColor(),
  check('active', 'Active must be a boolean').optional().isBoolean()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, updateLink);

// @route   DELETE /api/links/:id
// @desc    Delete a link
// @access  Private
router.delete('/:id', auth, deleteLink);

// @route   PUT /api/links/order
// @desc    Update link order
// @access  Private
router.put('/order/update', [
  auth,
  check('linkIds', 'linkIds must be an array of link IDs').isArray()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, updateLinkOrder);

export default router;
