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

// GET /api/admin/contact/sidebar
exports.getSidebar = async (req, res, next) => {
  try {
    const section = await getSectionAnyStatus('sidebar');
    
    if (!section) {
      return res.json({
        success: true,
        data: {
          quickActions: {},
          offices: [],
          socials: [],
        },
      });
    }

    const data = section.data || {};
    const offices = await getItems(section.id, 'offices');
    const socials = await getItems(section.id, 'socials');

    return res.json({
      success: true,
      data: {
        id: section.id,
        quickActions: data.quickActions || {},
        offices: offices.map(item => {
          const itemData = item.data || {};
          return {
            id: item.id,
            city: itemData.city || '',
            address: itemData.address || '',
            phone: itemData.phone || '',
            email: itemData.email || '',
            sortOrder: item.sort_order || 0,
            isActive: item.is_active !== undefined ? item.is_active : true,
          };
        }),
        socials: socials.map(item => {
          const itemData = item.data || {};
          return {
            id: item.id,
            iconName: itemData.iconName || '',
            href: itemData.href || '',
            label: itemData.label || '',
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

// PUT /api/admin/contact/sidebar
exports.updateSidebar = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      quickActions,
      offices = [],
      socials = [],
      isActive,
    } = req.body;

    const data = {
      quickActions: quickActions || {},
    };

    const section = await getSectionAnyStatus('sidebar');
    let sectionId;

    if (section) {
      sectionId = section.id;
      const existingData = section.data || {};
      const updateData = {
        quickActions: quickActions || existingData.quickActions || {},
      };
      await client.query(
        'UPDATE contact_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(updateData), isActive !== undefined ? isActive : true, sectionId]
      );
      await client.query('DELETE FROM contact_section_items WHERE section_id = $1 AND section_type IN ($2, $3)', [sectionId, 'offices', 'socials']);
    } else {
      const { rows: inserted } = await client.query(
        'INSERT INTO contact_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
        ['sidebar', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
      sectionId = inserted[0].id;
    }

    // Insert offices
    if (offices && offices.length > 0) {
      for (let i = 0; i < offices.length; i++) {
        const office = offices[i];
        const itemData = {
          city: office.city || '',
          address: office.address || '',
          phone: office.phone || '',
          email: office.email || '',
        };
        await client.query(
          'INSERT INTO contact_section_items (section_id, section_type, data, sort_order, is_active) VALUES ($1, $2, $3, $4, $5)',
          [sectionId, 'offices', JSON.stringify(itemData), office.sortOrder !== undefined ? office.sortOrder : i, office.isActive !== undefined ? office.isActive : true]
        );
      }
    }

    // Insert socials
    if (socials && socials.length > 0) {
      for (let i = 0; i < socials.length; i++) {
        const social = socials[i];
        const itemData = {
          iconName: social.iconName || '',
          href: social.href || '',
          label: social.label || '',
          gradient: social.gradient || '',
        };
        await client.query(
          'INSERT INTO contact_section_items (section_id, section_type, data, sort_order, is_active) VALUES ($1, $2, $3, $4, $5)',
          [sectionId, 'socials', JSON.stringify(itemData), social.sortOrder !== undefined ? social.sortOrder : i, social.isActive !== undefined ? social.isActive : true]
        );
      }
    }

    await client.query('COMMIT');

    const updatedSection = await getSectionAnyStatus('sidebar');
    if (!updatedSection) {
      client.release();
      return res.status(500).json({
        success: false,
        message: 'Không thể lấy dữ liệu sau khi cập nhật',
      });
    }
    const updatedOffices = await getItems(updatedSection.id, 'offices');
    const updatedSocials = await getItems(updatedSection.id, 'socials');

    return res.json({
      success: true,
      message: 'Đã cập nhật sidebar thành công',
      data: {
        id: updatedSection.id,
        quickActions: updatedSection.data?.quickActions || {},
        offices: updatedOffices.map(item => {
          const itemData = item.data || {};
          return {
            id: item.id,
            city: itemData.city || '',
            address: itemData.address || '',
            phone: itemData.phone || '',
            email: itemData.email || '',
            sortOrder: item.sort_order || 0,
            isActive: item.is_active !== undefined ? item.is_active : true,
          };
        }),
        socials: updatedSocials.map(item => {
          const itemData = item.data || {};
          return {
            id: item.id,
            iconName: itemData.iconName || '',
            href: itemData.href || '',
            label: itemData.label || '',
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

