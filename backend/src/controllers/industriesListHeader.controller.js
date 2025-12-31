const { pool } = require('../config/database');

// Helper function to get section by type
const getSection = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM industries_sections WHERE section_type = $1 AND is_active = true',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// GET /api/admin/industries/list-header
exports.getListHeader = async (req, res, next) => {
  try {
    const section = await getSection('list-header');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    return res.json({
      success: true,
      data: {
        id: section.id,
        title: data.title || '',
        description: data.description || '',
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/industries/list-header
exports.updateListHeader = async (req, res, next) => {
  try {
    const { title, description, isActive } = req.body;

    const data = {
      title: title || '',
      description: description || '',
    };

    const section = await getSection('list-header');

    if (section) {
      await pool.query(
        'UPDATE industries_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(data), isActive !== undefined ? isActive : true, section.id]
      );
    } else {
      await pool.query(
        'INSERT INTO industries_sections (section_type, data, is_active) VALUES ($1, $2, $3)',
        ['list-header', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
    }

    // Fetch updated data
    const updatedSection = await getSection('list-header');
    const updatedData = updatedSection.data || {};

    return res.json({
      success: true,
      message: 'Đã cập nhật list header thành công',
      data: {
        id: updatedSection.id,
        title: updatedData.title || '',
        description: updatedData.description || '',
        isActive: updatedSection.is_active !== undefined ? updatedSection.is_active : true,
        createdAt: updatedSection.created_at,
        updatedAt: updatedSection.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};
