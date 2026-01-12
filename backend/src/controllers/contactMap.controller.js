const { pool } = require('../config/database');

// Helper function to parse locale field from JSON string
const parseLocaleField = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && parsed !== null && ('vi' in parsed || 'en' in parsed || 'ja' in parsed)) {
        return parsed;
      }
    } catch (e) {
      // Not JSON, return as string
    }
    return value;
  }
  if (typeof value === 'object' && value !== null && ('vi' in value || 'en' in value || 'ja' in value)) {
    return value;
  }
  return value;
};

// Helper function to process locale field for database storage
const processLocaleField = (value) => {
  if (!value) return null;
  if (typeof value === 'object' && value !== null && ('vi' in value || 'en' in value || 'ja' in value)) {
    return JSON.stringify(value);
  }
  return typeof value === 'string' ? value : String(value);
};

// Helper function to get section by type (any status)
const getSectionAnyStatus = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM contact_sections WHERE section_type = $1',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// GET /api/admin/contact/map
exports.getMap = async (req, res, next) => {
  try {
    const section = await getSectionAnyStatus('map');
    
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
        address: parseLocaleField(data.address || ''),
        iframeSrc: data.iframeSrc || '',
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/contact/map
exports.updateMap = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      address,
      iframeSrc,
      isActive,
    } = req.body;

    const data = {
      address: processLocaleField(address) || '',
      iframeSrc: iframeSrc || '',
    };

    const section = await getSectionAnyStatus('map');

    if (section) {
      const existingData = section.data || {};
      const updateData = {
        address: address !== undefined ? processLocaleField(address) : (existingData.address || ''),
        iframeSrc: iframeSrc !== undefined && iframeSrc !== '' ? iframeSrc : (existingData.iframeSrc || ''),
      };
      await client.query(
        'UPDATE contact_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(updateData), isActive !== undefined ? isActive : true, section.id]
      );
    } else {
      await client.query(
        'INSERT INTO contact_sections (section_type, data, is_active) VALUES ($1, $2, $3)',
        ['map', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
    }

    await client.query('COMMIT');

    const updatedSection = await getSectionAnyStatus('map');
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
      message: 'Đã cập nhật map thành công',
      data: {
        id: updatedSection.id,
        address: parseLocaleField(updatedData.address || ''),
        iframeSrc: updatedData.iframeSrc || '',
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

