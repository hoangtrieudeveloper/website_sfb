const { pool } = require('../config/database');

// GET /api/admin/products/hero
exports.getHero = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, data, is_active, created_at, updated_at 
       FROM products_sections 
       WHERE section_type = 'hero' AND is_active = true 
       ORDER BY id DESC LIMIT 1`,
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const row = rows[0];
    const data = row.data || {};
    
    return res.json({
      success: true,
      data: {
        id: row.id,
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        primaryCtaText: data.primaryCtaText || '',
        primaryCtaLink: data.primaryCtaLink || '',
        secondaryCtaText: data.secondaryCtaText || '',
        secondaryCtaLink: data.secondaryCtaLink || '',
        stat1Label: data.stat1Label || '',
        stat1Value: data.stat1Value || '',
        stat2Label: data.stat2Label || '',
        stat2Value: data.stat2Value || '',
        stat3Label: data.stat3Label || '',
        stat3Value: data.stat3Value || '',
        backgroundGradient: data.backgroundGradient || '',
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/products/hero
exports.updateHero = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      stat1Label,
      stat1Value,
      stat2Label,
      stat2Value,
      stat3Label,
      stat3Value,
      backgroundGradient,
      isActive,
    } = req.body;

    // Kiểm tra xem đã có hero chưa
    const { rows: existing } = await pool.query(
      `SELECT id FROM products_sections 
       WHERE section_type = 'hero' AND is_active = true 
       ORDER BY id DESC LIMIT 1`,
    );

    const data = {
      title: title || '',
      subtitle: subtitle || '',
      description: description || '',
      primaryCtaText: primaryCtaText || '',
      primaryCtaLink: primaryCtaLink || '',
      secondaryCtaText: secondaryCtaText || '',
      secondaryCtaLink: secondaryCtaLink || '',
      stat1Label: stat1Label || '',
      stat1Value: stat1Value || '',
      stat2Label: stat2Label || '',
      stat2Value: stat2Value || '',
      stat3Label: stat3Label || '',
      stat3Value: stat3Value || '',
      backgroundGradient: backgroundGradient || '',
    };

    let result;

    if (existing.length > 0) {
      // Update existing
      const { rows } = await pool.query(
        `UPDATE products_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [JSON.stringify(data), isActive !== undefined ? isActive : true, existing[0].id],
      );
      result = rows[0];
    } else {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO products_sections (section_type, data, is_active)
         VALUES ('hero', $1, $2)
         RETURNING *`,
        [JSON.stringify(data), isActive !== undefined ? isActive : true],
      );
      result = rows[0];
    }

    const resultData = result.data || {};

    return res.json({
      success: true,
      data: {
        id: result.id,
        title: resultData.title || '',
        subtitle: resultData.subtitle || '',
        description: resultData.description || '',
        primaryCtaText: resultData.primaryCtaText || '',
        primaryCtaLink: resultData.primaryCtaLink || '',
        secondaryCtaText: resultData.secondaryCtaText || '',
        secondaryCtaLink: resultData.secondaryCtaLink || '',
        stat1Label: resultData.stat1Label || '',
        stat1Value: resultData.stat1Value || '',
        stat2Label: resultData.stat2Label || '',
        stat2Value: resultData.stat2Value || '',
        stat3Label: resultData.stat3Label || '',
        stat3Value: resultData.stat3Value || '',
        backgroundGradient: resultData.backgroundGradient || '',
        isActive: result.is_active !== undefined ? result.is_active : true,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};
