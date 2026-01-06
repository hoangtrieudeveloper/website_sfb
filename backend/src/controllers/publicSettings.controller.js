const { pool } = require('../config/database');

// GET /api/public/settings
exports.getPublicSettings = async (req, res, next) => {
  try {
    const { keys } = req.query; // Comma-separated list of keys, e.g., ?keys=logo,phone,email
    
    let query = 'SELECT setting_key, setting_value FROM site_settings';
    const params = [];
    
    if (keys) {
      const keyArray = keys.split(',').map(k => k.trim());
      query += ' WHERE setting_key = ANY($1)';
      params.push(keyArray);
    }
    
    query += ' ORDER BY setting_key';
    
    const { rows } = await pool.query(query, params);
    
    // Transform to simple key-value object
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = row.setting_value || '';
    });
    
    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return next(error);
  }
};


