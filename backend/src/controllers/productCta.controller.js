const { pool } = require('../config/database');

// Helper function to get section regardless of is_active status (for admin)
const getSectionAnyStatus = async (sectionType) => {
  const { rows } = await pool.query(
    `SELECT id, data, is_active, created_at, updated_at 
     FROM products_sections 
     WHERE section_type = $1 
     ORDER BY id DESC LIMIT 1`,
    [sectionType],
  );
  return rows.length > 0 ? rows[0] : null;
};

// GET /api/admin/products/cta
exports.getCta = async (req, res, next) => {
  try {
    const section = await getSectionAnyStatus('cta');

    if (!section) {
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

    const data = section.data || {};
    
    return res.json({
      success: true,
      data: {
        id: section.id,
        title: data.title || '',
        description: data.description || '',
        primaryButtonText: data.primaryButtonText || data.primary?.text || '',
        primaryButtonLink: data.primaryButtonLink || data.primary?.link || '',
        secondaryButtonText: data.secondaryButtonText || data.secondary?.text || '',
        secondaryButtonLink: data.secondaryButtonLink || data.secondary?.link || '',
        backgroundColor: data.backgroundColor || '#29A3DD',
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/products/cta
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

    // Check if CTA section exists (regardless of is_active status)
    const existing = await getSectionAnyStatus('cta');

    // Get existing data to preserve fields that are not provided
    const existingData = existing?.data || {};

    const data = {
      title: (title !== undefined && title !== null && title.trim() !== '') ? title : (existingData.title || ''),
      description: (description !== undefined && description !== null && description.trim() !== '') ? description : (existingData.description || ''),
      primaryButtonText: (primaryButtonText !== undefined && primaryButtonText !== null && primaryButtonText.trim() !== '') ? primaryButtonText : (existingData.primaryButtonText || ''),
      primaryButtonLink: (primaryButtonLink !== undefined && primaryButtonLink !== null && primaryButtonLink.trim() !== '') ? primaryButtonLink : (existingData.primaryButtonLink || ''),
      secondaryButtonText: (secondaryButtonText !== undefined && secondaryButtonText !== null && secondaryButtonText.trim() !== '') ? secondaryButtonText : (existingData.secondaryButtonText || ''),
      secondaryButtonLink: (secondaryButtonLink !== undefined && secondaryButtonLink !== null && secondaryButtonLink.trim() !== '') ? secondaryButtonLink : (existingData.secondaryButtonLink || ''),
      backgroundColor: (backgroundColor !== undefined && backgroundColor !== null && backgroundColor.trim() !== '') ? backgroundColor : (existingData.backgroundColor || '#29A3DD'),
    };

    let result;
    if (existing) {
      // Update existing
      await pool.query(
        `UPDATE products_sections 
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [
          JSON.stringify(data),
          isActive !== undefined ? isActive : (existing.is_active !== undefined ? existing.is_active : true),
          existing.id,
        ],
      );
      result = { id: existing.id };
    } else {
      // Create new
      const { rows: newRows } = await pool.query(
        `INSERT INTO products_sections (section_type, data, is_active)
         VALUES ('cta', $1, $2)
         RETURNING id`,
        [
          JSON.stringify(data),
          isActive !== undefined ? isActive : true,
        ],
      );
      result = { id: newRows[0].id };
    }

    // Fetch updated data
    const { rows: updatedRows } = await pool.query(
      `SELECT id, data, is_active, created_at, updated_at 
       FROM products_sections 
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

