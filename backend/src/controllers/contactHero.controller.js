const { pool } = require('../config/database');

// Helper function to get section by type (only active)
const getSection = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM contact_sections WHERE section_type = $1 AND is_active = true',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Helper function to get section by type (any status)
const getSectionAnyStatus = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM contact_sections WHERE section_type = $1',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// GET /api/admin/contact/hero
exports.getHero = async (req, res, next) => {
  try {
    const section = await getSectionAnyStatus('hero');
    
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
        badge: data.badge || '',
        title: data.title || { prefix: '', highlight: '' },
        description: data.description || '',
        iconName: data.iconName || 'MessageCircle',
        image: data.image || '',
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/contact/hero
exports.updateHero = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      badge,
      title,
      description,
      iconName,
      image,
      isActive,
    } = req.body;

    const data = {
      badge: badge || '',
      title: title || { prefix: '', highlight: '' },
      description: description || '',
      iconName: iconName || 'MessageCircle',
      image: image || '',
    };

    const section = await getSectionAnyStatus('hero');

    if (section) {
      const existingData = section.data || {};
      const updateData = {
        badge: badge !== undefined && badge !== '' ? badge : (existingData.badge || ''),
        title: title || existingData.title || { prefix: '', highlight: '' },
        description: description !== undefined && description !== '' ? description : (existingData.description || ''),
        iconName: iconName || existingData.iconName || 'MessageCircle',
        image: image !== undefined && image !== '' ? image : (existingData.image || ''),
      };
      await client.query(
        'UPDATE contact_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(updateData), isActive !== undefined ? isActive : true, section.id]
      );
    } else {
      await client.query(
        'INSERT INTO contact_sections (section_type, data, is_active) VALUES ($1, $2, $3)',
        ['hero', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
    }

    await client.query('COMMIT');

    const updatedSection = await getSectionAnyStatus('hero');
    if (!updatedSection) {
      client.release();
      return res.status(500).json({
        success: false,
        message: 'Không thể lấy dữ liệu sau khi cập nhật',
      });
    }

    const updatedData = updatedSection.data || {};

    return res.json({
      success: true,
      message: 'Đã cập nhật hero thành công',
      data: {
        id: updatedSection.id,
        badge: updatedData.badge || '',
        title: updatedData.title || { prefix: '', highlight: '' },
        description: updatedData.description || '',
        iconName: updatedData.iconName || 'MessageCircle',
        image: updatedData.image || '',
        isActive: updatedSection.is_active !== undefined ? updatedSection.is_active : true,
        createdAt: updatedSection.created_at,
        updatedAt: updatedSection.updated_at,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
};

