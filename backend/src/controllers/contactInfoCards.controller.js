const { pool } = require('../config/database');

// Helper function to get section by type (any status)
const getSectionAnyStatus = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM contact_sections WHERE section_type = $1',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Helper function to get items by section_id and section_type
const getItems = async (sectionId, sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM contact_section_items WHERE section_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
    [sectionId, sectionType]
  );
  return rows;
};

// GET /api/admin/contact/info-cards
exports.getInfoCards = async (req, res, next) => {
  try {
    const section = await getSectionAnyStatus('info-cards');
    
    if (!section) {
      return res.json({
        success: true,
        data: {
          items: [],
        },
      });
    }

    const items = await getItems(section.id, 'info-cards');

    return res.json({
      success: true,
      data: {
        id: section.id,
        items: items.map(item => {
          const itemData = item.data || {};
          return {
            id: item.id,
            iconName: itemData.iconName || '',
            title: itemData.title || '',
            content: itemData.content || '',
            link: itemData.link || null,
            gradient: itemData.gradient || '',
            sortOrder: item.sort_order || 0,
            isActive: item.is_active !== undefined ? item.is_active : true,
          };
        }),
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/contact/info-cards
exports.updateInfoCards = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      items = [],
      isActive,
    } = req.body;

    const section = await getSectionAnyStatus('info-cards');
    let sectionId;

    if (section) {
      sectionId = section.id;
      await client.query(
        'UPDATE contact_sections SET is_active = $1 WHERE id = $2',
        [isActive !== undefined ? isActive : true, sectionId]
      );
      await client.query('DELETE FROM contact_section_items WHERE section_id = $1 AND section_type = $2', [sectionId, 'info-cards']);
    } else {
      const { rows: inserted } = await client.query(
        'INSERT INTO contact_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
        ['info-cards', '{}', isActive !== undefined ? isActive : true]
      );
      sectionId = inserted[0].id;
    }

    // Insert items
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemData = {
          iconName: item.iconName || '',
          title: item.title || '',
          content: item.content || '',
          link: item.link || null,
          gradient: item.gradient || '',
        };
        await client.query(
          'INSERT INTO contact_section_items (section_id, section_type, data, sort_order, is_active) VALUES ($1, $2, $3, $4, $5)',
          [sectionId, 'info-cards', JSON.stringify(itemData), item.sortOrder !== undefined ? item.sortOrder : i, item.isActive !== undefined ? item.isActive : true]
        );
      }
    }

    await client.query('COMMIT');

    const updatedSection = await getSectionAnyStatus('info-cards');
    if (!updatedSection) {
      client.release();
      return res.status(500).json({
        success: false,
        message: 'Không thể lấy dữ liệu sau khi cập nhật',
      });
    }
    const updatedItems = await getItems(updatedSection.id, 'info-cards');

    return res.json({
      success: true,
      message: 'Đã cập nhật info cards thành công',
      data: {
        id: updatedSection.id,
        items: updatedItems.map(item => {
          const itemData = item.data || {};
          return {
            id: item.id,
            iconName: itemData.iconName || '',
            title: itemData.title || '',
            content: itemData.content || '',
            link: itemData.link || null,
            gradient: itemData.gradient || '',
            sortOrder: item.sort_order || 0,
            isActive: item.is_active !== undefined ? item.is_active : true,
          };
        }),
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

