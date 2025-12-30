const { pool } = require('../config/database');

// GET /api/admin/products/hero
exports.getHero = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM product_page_hero WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const row = rows[0];
    return res.json({
      success: true,
      data: {
        id: row.id,
        title: row.title,
        subtitle: row.subtitle || '',
        description: row.description || '',
        primaryCtaText: row.primary_cta_text || '',
        primaryCtaLink: row.primary_cta_link || '',
        secondaryCtaText: row.secondary_cta_text || '',
        secondaryCtaLink: row.secondary_cta_link || '',
        stat1Label: row.stat_1_label || '',
        stat1Value: row.stat_1_value || '',
        stat2Label: row.stat_2_label || '',
        stat2Value: row.stat_2_value || '',
        stat3Label: row.stat_3_label || '',
        stat3Value: row.stat_3_value || '',
        backgroundGradient: row.background_gradient || '',
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
      'SELECT id FROM product_page_hero WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    let result;

    if (existing.length > 0) {
      // Update existing
      const fields = [];
      const params = [];

      const addField = (column, value) => {
        if (value !== undefined) {
          params.push(value);
          fields.push(`${column} = $${params.length}`);
        }
      };

      addField('title', title);
      addField('subtitle', subtitle);
      addField('description', description);
      addField('primary_cta_text', primaryCtaText);
      addField('primary_cta_link', primaryCtaLink);
      addField('secondary_cta_text', secondaryCtaText);
      addField('secondary_cta_link', secondaryCtaLink);
      addField('stat_1_label', stat1Label);
      addField('stat_1_value', stat1Value);
      addField('stat_2_label', stat2Label);
      addField('stat_2_value', stat2Value);
      addField('stat_3_label', stat3Label);
      addField('stat_3_value', stat3Value);
      addField('background_gradient', backgroundGradient);
      addField('is_active', isActive);

      if (fields.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Không có dữ liệu để cập nhật',
        });
      }

      params.push(existing[0].id);

      const { rows } = await pool.query(
        `
          UPDATE product_page_hero
          SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
          WHERE id = $${params.length}
          RETURNING *
        `,
        params,
      );

      result = rows[0];
    } else {
      // Create new
      const { rows } = await pool.query(
        `
          INSERT INTO product_page_hero (
            title, subtitle, description,
            primary_cta_text, primary_cta_link,
            secondary_cta_text, secondary_cta_link,
            stat_1_label, stat_1_value,
            stat_2_label, stat_2_value,
            stat_3_label, stat_3_value,
            background_gradient, is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
          RETURNING *
        `,
        [
          title || '',
          subtitle || '',
          description || '',
          primaryCtaText || '',
          primaryCtaLink || '',
          secondaryCtaText || '',
          secondaryCtaLink || '',
          stat1Label || '',
          stat1Value || '',
          stat2Label || '',
          stat2Value || '',
          stat3Label || '',
          stat3Value || '',
          backgroundGradient || '',
          isActive !== undefined ? isActive : true,
        ],
      );

      result = rows[0];
    }

    return res.json({
      success: true,
      data: {
        id: result.id,
        title: result.title,
        subtitle: result.subtitle || '',
        description: result.description || '',
        primaryCtaText: result.primary_cta_text || '',
        primaryCtaLink: result.primary_cta_link || '',
        secondaryCtaText: result.secondary_cta_text || '',
        secondaryCtaLink: result.secondary_cta_link || '',
        stat1Label: result.stat_1_label || '',
        stat1Value: result.stat_1_value || '',
        stat2Label: result.stat_2_label || '',
        stat2Value: result.stat_2_value || '',
        stat3Label: result.stat_3_label || '',
        stat3Value: result.stat_3_value || '',
        backgroundGradient: result.background_gradient || '',
        isActive: result.is_active !== undefined ? result.is_active : true,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

