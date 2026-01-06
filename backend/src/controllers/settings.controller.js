const { pool } = require('../config/database');

// GET /api/admin/settings
exports.getSettings = async (req, res, next) => {
  try {
    const { category } = req.query;
    
    let query = 'SELECT * FROM site_settings';
    const params = [];
    
    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }
    
    query += ' ORDER BY category, setting_key';
    
    const { rows } = await pool.query(query, params);
    
    // Transform to object format for easier access
    const settings = {};
    rows.forEach(row => {
      settings[row.setting_key] = {
        value: row.setting_value || '',
        type: row.setting_type || 'text',
        description: row.description || '',
        category: row.category || 'general',
      };
    });
    
    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/settings/:key
exports.getSettingByKey = async (req, res, next) => {
  try {
    const { key } = req.params;
    
    const { rows } = await pool.query(
      'SELECT * FROM site_settings WHERE setting_key = $1',
      [key]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found',
      });
    }
    
    return res.json({
      success: true,
      data: {
        key: rows[0].setting_key,
        value: rows[0].setting_value || '',
        type: rows[0].setting_type || 'text',
        description: rows[0].description || '',
        category: rows[0].category || 'general',
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/settings
exports.updateSettings = async (req, res, next) => {
  try {
    const { settings } = req.body; // { key: value, ... }
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Invalid settings data',
      });
    }
    
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const [key, value] of Object.entries(settings)) {
        // Check if setting exists
        const { rows } = await client.query(
          'SELECT id FROM site_settings WHERE setting_key = $1',
          [key]
        );
        
        if (rows.length > 0) {
          // Update existing setting
          await client.query(
            'UPDATE site_settings SET setting_value = $1, updated_at = CURRENT_TIMESTAMP WHERE setting_key = $2',
            [value || '', key]
          );
        } else {
          // Insert new setting
          await client.query(
            'INSERT INTO site_settings (setting_key, setting_value, setting_type, category) VALUES ($1, $2, $3, $4)',
            [key, value || '', 'text', 'general']
          );
        }
      }
      
      await client.query('COMMIT');
      
      return res.json({
        success: true,
        message: 'Settings updated successfully',
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/settings/:key
exports.updateSetting = async (req, res, next) => {
  try {
    const { key } = req.params;
    const { value, type, description, category } = req.body;
    
    const { rows } = await pool.query(
      'SELECT id FROM site_settings WHERE setting_key = $1',
      [key]
    );
    
    if (rows.length > 0) {
      // Update existing setting
      const updateFields = ['setting_value = $1', 'updated_at = CURRENT_TIMESTAMP'];
      const params = [value || ''];
      let paramIndex = 2;
      
      if (type) {
        updateFields.push(`setting_type = $${paramIndex}`);
        params.push(type);
        paramIndex++;
      }
      
      if (description !== undefined) {
        updateFields.push(`description = $${paramIndex}`);
        params.push(description);
        paramIndex++;
      }
      
      if (category) {
        updateFields.push(`category = $${paramIndex}`);
        params.push(category);
        paramIndex++;
      }
      
      params.push(key);
      
      await pool.query(
        `UPDATE site_settings SET ${updateFields.join(', ')} WHERE setting_key = $${paramIndex}`,
        params
      );
    } else {
      // Insert new setting
      await pool.query(
        'INSERT INTO site_settings (setting_key, setting_value, setting_type, description, category) VALUES ($1, $2, $3, $4, $5)',
        [key, value || '', type || 'text', description || '', category || 'general']
      );
    }
    
    return res.json({
      success: true,
      message: 'Setting updated successfully',
    });
  } catch (error) {
    return next(error);
  }
};


