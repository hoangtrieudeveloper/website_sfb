const { pool } = require('../config/database');

// GET /api/admin/industries/cta
exports.getCta = async (req, res, next) => {
  try {
    // For admin, get section with any status
    const { rows } = await pool.query(
      `SELECT id, data, is_active, created_at, updated_at 
       FROM industries_sections 
       WHERE section_type = 'cta'
       ORDER BY id DESC LIMIT 1`,
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: {
          title: '',
          description: '',
          primaryButtonText: '',
          primaryButtonLink: '',
          secondaryButtonText: '',
          secondaryButtonLink: '',
          backgroundColor: '#29A3DD',
          isActive: true,
        },
      });
    }

    const row = rows[0];
    const data = row.data || {};
    
    return res.json({
      success: true,
      data: {
        id: row.id,
        title: data.title || '',
        description: data.description || '',
        primaryButtonText: data.primaryButtonText || data.primary?.text || '',
        primaryButtonLink: data.primaryButtonLink || data.primary?.link || '',
        secondaryButtonText: data.secondaryButtonText || data.secondary?.text || '',
        secondaryButtonLink: data.secondaryButtonLink || data.secondary?.link || '',
        backgroundColor: data.backgroundColor || '#29A3DD',
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/industries/cta
exports.updateCta = async (req, res, next) => {
  try {
    const {
      title,
      description,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      backgroundColor,
      isActive,
    } = req.body;

    // Check if CTA section exists
    let { rows: existingRows } = await pool.query(
      `SELECT id FROM industries_sections WHERE section_type = 'cta' LIMIT 1`,
    );

    let result;
    if (existingRows.length > 0) {
      // Update existing
      await pool.query(
        `UPDATE industries_sections 
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE section_type = 'cta'`,
        [
          JSON.stringify({
            title: title || '',
            description: description || '',
            primaryButtonText: primaryButtonText || '',
            primaryButtonLink: primaryButtonLink || '',
            secondaryButtonText: secondaryButtonText || '',
            secondaryButtonLink: secondaryButtonLink || '',
            backgroundColor: backgroundColor || '#29A3DD',
          }),
          isActive !== undefined ? isActive : true,
        ],
      );
      result = existingRows[0];
    } else {
      // Create new
      const { rows: newRows } = await pool.query(
        `INSERT INTO industries_sections (section_type, data, is_active)
         VALUES ('cta', $1, $2)
         RETURNING id`,
        [
          JSON.stringify({
            title: title || '',
            description: description || '',
            primaryButtonText: primaryButtonText || '',
            primaryButtonLink: primaryButtonLink || '',
            secondaryButtonText: secondaryButtonText || '',
            secondaryButtonLink: secondaryButtonLink || '',
            backgroundColor: backgroundColor || '#29A3DD',
          }),
          isActive !== undefined ? isActive : true,
        ],
      );
      result = { id: newRows[0].id };
    }

    // Fetch updated data
    const { rows: updatedRows } = await pool.query(
      `SELECT id, data, is_active, created_at, updated_at 
       FROM industries_sections 
       WHERE id = $1`,
      [result.id],
    );

    const updatedRow = updatedRows[0];
    const updatedData = updatedRow.data || {};

    return res.json({
      success: true,
      data: {
        id: updatedRow.id,
        title: updatedData.title || '',
        description: updatedData.description || '',
        primaryButtonText: updatedData.primaryButtonText || '',
        primaryButtonLink: updatedData.primaryButtonLink || '',
        secondaryButtonText: updatedData.secondaryButtonText || '',
        secondaryButtonLink: updatedData.secondaryButtonLink || '',
        backgroundColor: updatedData.backgroundColor || '#29A3DD',
        isActive: updatedRow.is_active !== undefined ? updatedRow.is_active : true,
        createdAt: updatedRow.created_at,
        updatedAt: updatedRow.updated_at,
      },
      message: 'Đã cập nhật CTA thành công',
    });
  } catch (error) {
    return next(error);
  }
};

