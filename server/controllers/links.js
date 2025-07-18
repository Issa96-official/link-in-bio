import { dbAll, dbGet, dbRun } from '../db/database.js';

// Get all links
export const getAllLinks = async (req, res) => {
  try {
    const links = await dbAll(
      'SELECT * FROM links WHERE active = 1 ORDER BY order_num ASC'
    );
    res.json(links);
  } catch (err) {
    console.error('Get all links error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all links (admin)
export const getAllLinksAdmin = async (req, res) => {
  try {
    const links = await dbAll(
      'SELECT * FROM links ORDER BY order_num ASC'
    );
    res.json(links);
  } catch (err) {
    console.error('Get all links (admin) error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get link by ID
export const getLinkById = async (req, res) => {
  try {
    const { id } = req.params;
    const link = await dbGet('SELECT * FROM links WHERE id = ?', [id]);
    
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    res.json(link);
  } catch (err) {
    console.error('Get link by id error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new link
export const createLink = async (req, res) => {
  try {
    const { title, url, icon, color } = req.body;
    
    // Get the highest order number and increment by 1
    const maxOrderResult = await dbGet('SELECT MAX(order_num) as maxOrder FROM links');
    const orderNum = maxOrderResult.maxOrder ? maxOrderResult.maxOrder + 1 : 1;
    
    const result = await dbRun(
      'INSERT INTO links (title, url, icon, color, order_num) VALUES (?, ?, ?, ?, ?)',
      [title, url, icon, color, orderNum]
    );
    
    const newLink = await dbGet('SELECT * FROM links WHERE id = ?', [result.id]);
    res.status(201).json(newLink);
  } catch (err) {
    console.error('Create link error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update link
export const updateLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, icon, color, active } = req.body;
    
    // Check if link exists
    const link = await dbGet('SELECT * FROM links WHERE id = ?', [id]);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    await dbRun(
      'UPDATE links SET title = ?, url = ?, icon = ?, color = ?, active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        title || link.title,
        url || link.url,
        icon || link.icon,
        color || link.color,
        active !== undefined ? active : link.active,
        id
      ]
    );
    
    const updatedLink = await dbGet('SELECT * FROM links WHERE id = ?', [id]);
    res.json(updatedLink);
  } catch (err) {
    console.error('Update link error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete link
export const deleteLink = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if link exists
    const link = await dbGet('SELECT * FROM links WHERE id = ?', [id]);
    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }
    
    await dbRun('DELETE FROM links WHERE id = ?', [id]);
    
    // Re-order remaining links
    const remainingLinks = await dbAll('SELECT id FROM links ORDER BY order_num ASC');
    
    for (let i = 0; i < remainingLinks.length; i++) {
      await dbRun('UPDATE links SET order_num = ? WHERE id = ?', [i + 1, remainingLinks[i].id]);
    }
    
    res.json({ message: 'Link deleted successfully' });
  } catch (err) {
    console.error('Delete link error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update link order
export const updateLinkOrder = async (req, res) => {
  try {
    const { linkIds } = req.body;
    
    if (!Array.isArray(linkIds)) {
      return res.status(400).json({ message: 'linkIds must be an array' });
    }
    
    // Update the order of each link
    for (let i = 0; i < linkIds.length; i++) {
      await dbRun('UPDATE links SET order_num = ? WHERE id = ?', [i + 1, linkIds[i]]);
    }
    
    const updatedLinks = await dbAll('SELECT * FROM links ORDER BY order_num ASC');
    res.json(updatedLinks);
  } catch (err) {
    console.error('Update link order error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
