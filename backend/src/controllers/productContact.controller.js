const { pool } = require('../config/database');

// GET /api/admin/products/contact
exports.getContact = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM product_contact_banner WHERE is_active = true ORDER BY id DESC LIMIT 1',
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
        description: row.description || '',
        primaryCtaText: row.primary_cta_text || '',
        primaryCtaLink: row.primary_cta_link || '',
        secondaryCtaText: row.secondary_cta_text || '',
        secondaryCtaLink: row.secondary_cta_link || '',
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

// PUT /api/admin/products/contact
exports.updateContact = async (req, res, next) => {
  try {
    const {
      title,
      description,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      backgroundGradient,
      isActive,
    } = req.body;

    // Kiểm tra xem đã có contact banner chưa
    const { rows: existing } = await pool.query(
      'SELECT id FROM product_contact_banner WHERE is_active = true ORDER BY id DESC LIMIT 1',
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
      addField('description', description);
      addField('primary_cta_text', primaryCtaText);
      addField('primary_cta_link', primaryCtaLink);
      addField('secondary_cta_text', secondaryCtaText);
      addField('secondary_cta_link', secondaryCtaLink);
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
          UPDATE product_contact_banner
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
          INSERT INTO product_contact_banner (
            title, description,
            primary_cta_text, primary_cta_link,
            secondary_cta_text, secondary_cta_link,
            background_gradient, is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING *
        `,
        [
          title || '',
          description || '',
          primaryCtaText || '',
          primaryCtaLink || '',
          secondaryCtaText || '',
          secondaryCtaLink || '',
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
        description: result.description || '',
        primaryCtaText: result.primary_cta_text || '',
        primaryCtaLink: result.primary_cta_link || '',
        secondaryCtaText: result.secondary_cta_text || '',
        secondaryCtaLink: result.secondary_cta_link || '',
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

