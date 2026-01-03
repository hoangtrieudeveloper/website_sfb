const { pool } = require('../config/database');

// Helper function to get section by type (any status)
const getSectionAnyStatus = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM contact_sections WHERE section_type = $1',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// GET /api/admin/contact/form
exports.getForm = async (req, res, next) => {
  try {
    const section = await getSectionAnyStatus('form');
    
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
        header: data.header || '',
        description: data.description || '',
        fields: data.fields || {},
        button: data.button || { submit: '', success: '' },
        services: data.services || [],
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/contact/form
exports.updateForm = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      header,
      description,
      fields,
      button,
      services,
      isActive,
    } = req.body;

    const data = {
      header: header || '',
      description: description || '',
      fields: fields || {},
      button: button || { submit: '', success: '' },
      services: services || [],
    };

    const section = await getSectionAnyStatus('form');

    if (section) {
      const existingData = section.data || {};
      const updateData = {
        header: header !== undefined && header !== '' ? header : (existingData.header || ''),
        description: description !== undefined && description !== '' ? description : (existingData.description || ''),
        fields: fields || existingData.fields || {},
        button: button || existingData.button || { submit: '', success: '' },
        services: services || existingData.services || [],
      };
      await client.query(
        'UPDATE contact_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(updateData), isActive !== undefined ? isActive : true, section.id]
      );
    } else {
      await client.query(
        'INSERT INTO contact_sections (section_type, data, is_active) VALUES ($1, $2, $3)',
        ['form', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
    }

    await client.query('COMMIT');

    const updatedSection = await getSectionAnyStatus('form');
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
      message: 'Đã cập nhật form thành công',
      data: {
        id: updatedSection.id,
        header: updatedData.header || '',
        description: updatedData.description || '',
        fields: updatedData.fields || {},
        button: updatedData.button || { submit: '', success: '' },
        services: updatedData.services || [],
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

