const { pool } = require('../config/database');

// Generic function to get section by type
const getSection = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM about_sections WHERE section_type = $1 AND is_active = true',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Generic function to get items by section_id and section_type
const getItems = async (sectionId, sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM about_section_items WHERE section_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
    [sectionId, sectionType]
  );
  return rows;
};

// ==================== HERO ====================
exports.getHero = async (req, res, next) => {
  try {
    const section = await getSection('hero');
    
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
        titleLine1: data.titleLine1 || '',
        titleLine2: data.titleLine2 || '',
        titleLine3: data.titleLine3 || '',
        description: data.description || '',
        buttonText: data.buttonText || '',
        buttonLink: data.buttonLink || '',
        image: data.image || '',
        backgroundGradient: data.backgroundGradient || '',
        isActive: section.is_active !== undefined ? section.is_active : true,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateHero = async (req, res, next) => {
  try {
    const {
      titleLine1,
      titleLine2,
      titleLine3,
      description,
      buttonText,
      buttonLink,
      image,
      backgroundGradient,
      isActive,
    } = req.body;

    const data = {
      titleLine1: titleLine1 || '',
      titleLine2: titleLine2 || '',
      titleLine3: titleLine3 || '',
      description: description || '',
      buttonText: buttonText || '',
      buttonLink: buttonLink || '',
      image: image || '',
      backgroundGradient: backgroundGradient || '',
    };

    const section = await getSection('hero');

    if (section) {
      await pool.query(
        'UPDATE about_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(data), isActive !== undefined ? isActive : true, section.id]
      );
    } else {
      await pool.query(
        'INSERT INTO about_sections (section_type, data, is_active) VALUES ($1, $2, $3)',
        ['hero', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
    }

    return res.json({ success: true, message: 'Đã cập nhật hero' });
  } catch (error) {
    return next(error);
  }
};

// ==================== COMPANY ====================
exports.getCompany = async (req, res, next) => {
  try {
    const section = await getSection('company');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const contacts = await getItems(section.id, 'company');

    return res.json({
      success: true,
      data: {
        id: section.id,
        headerSub: data.headerSub || '',
        headerTitleLine1: data.headerTitleLine1 || '',
        headerTitleLine2: data.headerTitleLine2 || '',
        contentImage1: data.contentImage1 || '',
        contentTitle: data.contentTitle || '',
        contentDescription: data.contentDescription || '',
        contentButtonText: data.contentButtonText || '',
        contentButtonLink: data.contentButtonLink || '',
        contactImage2: data.contactImage2 || '',
        contactButtonText: data.contactButtonText || '',
        contactButtonLink: data.contactButtonLink || '',
        contacts: contacts.map(c => {
          const itemData = c.data || {};
          return {
            id: c.id,
            iconName: itemData.iconName || 'Building2',
            title: itemData.title || '',
            text: itemData.text || '',
            isHighlight: itemData.isHighlight || false,
            sortOrder: c.sort_order || 0,
          };
        }),
        isActive: section.is_active !== undefined ? section.is_active : true,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateCompany = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      headerSub,
      headerTitleLine1,
      headerTitleLine2,
      contentImage1,
      contentTitle,
      contentDescription,
      contentButtonText,
      contentButtonLink,
      contactImage2,
      contactButtonText,
      contactButtonLink,
      contacts = [],
      isActive,
    } = req.body;

    const data = {
      headerSub: headerSub || '',
      headerTitleLine1: headerTitleLine1 || '',
      headerTitleLine2: headerTitleLine2 || '',
      contentImage1: contentImage1 || '',
      contentTitle: contentTitle || '',
      contentDescription: contentDescription || '',
      contentButtonText: contentButtonText || '',
      contentButtonLink: contentButtonLink || '',
      contactImage2: contactImage2 || '',
      contactButtonText: contactButtonText || '',
      contactButtonLink: contactButtonLink || '',
    };

    const section = await getSection('company');
    let companyId;

    if (section) {
      companyId = section.id;
      await client.query(
        'UPDATE about_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(data), isActive !== undefined ? isActive : true, companyId]
      );
      await client.query('DELETE FROM about_section_items WHERE section_id = $1 AND section_type = $2', [companyId, 'company']);
    } else {
      const { rows: inserted } = await client.query(
        'INSERT INTO about_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
        ['company', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
      companyId = inserted[0].id;
    }

    // Insert contacts
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      const itemData = {
        iconName: contact.iconName || 'Building2',
        title: contact.title || '',
        text: contact.text || '',
        isHighlight: contact.isHighlight || false,
      };
      await client.query(
        'INSERT INTO about_section_items (section_id, section_type, data, sort_order) VALUES ($1, $2, $3, $4)',
        [companyId, 'company', JSON.stringify(itemData), i]
      );
    }

    await client.query('COMMIT');
    return res.json({ success: true, message: 'Đã cập nhật company' });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
};

// ==================== VISION & MISSION ====================
exports.getVisionMission = async (req, res, next) => {
  try {
    const section = await getSection('vision-mission');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const items = await getItems(section.id, 'vision-mission');

    return res.json({
      success: true,
      data: {
        id: section.id,
        headerTitle: data.headerTitle || '',
        headerDescription: data.headerDescription || '',
        items: items.map(i => {
          const itemData = i.data || {};
          return {
            id: i.id,
            text: itemData.text || '',
            sortOrder: i.sort_order || 0,
          };
        }),
        isActive: section.is_active !== undefined ? section.is_active : true,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateVisionMission = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { headerTitle, headerDescription, items = [], isActive } = req.body;

    const data = {
      headerTitle: headerTitle || '',
      headerDescription: headerDescription || '',
    };

    const section = await getSection('vision-mission');
    let vmId;

    if (section) {
      vmId = section.id;
      await client.query(
        'UPDATE about_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(data), isActive !== undefined ? isActive : true, vmId]
      );
      await client.query('DELETE FROM about_section_items WHERE section_id = $1 AND section_type = $2', [vmId, 'vision-mission']);
    } else {
      const { rows: inserted } = await client.query(
        'INSERT INTO about_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
        ['vision-mission', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
      vmId = inserted[0].id;
    }

    // Insert items
    for (let i = 0; i < items.length; i++) {
      const itemData = { text: items[i].text || '' };
      await client.query(
        'INSERT INTO about_section_items (section_id, section_type, data, sort_order) VALUES ($1, $2, $3, $4)',
        [vmId, 'vision-mission', JSON.stringify(itemData), i]
      );
    }

    await client.query('COMMIT');
    return res.json({ success: true, message: 'Đã cập nhật vision & mission' });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
};

// ==================== CORE VALUES ====================
exports.getCoreValues = async (req, res, next) => {
  try {
    const section = await getSection('core-values');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const items = await getItems(section.id, 'core-values');

    return res.json({
      success: true,
      data: {
        id: section.id,
        headerTitle: data.headerTitle || '',
        headerDescription: data.headerDescription || '',
        items: items.map(i => {
          const itemData = i.data || {};
          return {
            id: i.id,
            iconName: itemData.iconName || 'Lightbulb',
            title: itemData.title || '',
            description: itemData.description || '',
            gradient: itemData.gradient || '',
            sortOrder: i.sort_order || 0,
            isActive: i.is_active !== undefined ? i.is_active : true,
          };
        }),
        isActive: section.is_active !== undefined ? section.is_active : true,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateCoreValues = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { headerTitle, headerDescription, items = [], isActive } = req.body;

    const data = {
      headerTitle: headerTitle || '',
      headerDescription: headerDescription || '',
    };

    const section = await getSection('core-values');
    let cvId;

    if (section) {
      cvId = section.id;
      await client.query(
        'UPDATE about_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(data), isActive !== undefined ? isActive : true, cvId]
      );
      await client.query('DELETE FROM about_section_items WHERE section_id = $1 AND section_type = $2', [cvId, 'core-values']);
    } else {
      const { rows: inserted } = await client.query(
        'INSERT INTO about_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
        ['core-values', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
      cvId = inserted[0].id;
    }

    // Insert items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemData = {
        iconName: item.iconName || 'Lightbulb',
        title: item.title || '',
        description: item.description || '',
        gradient: item.gradient || '',
      };
      await client.query(
        'INSERT INTO about_section_items (section_id, section_type, data, sort_order, is_active) VALUES ($1, $2, $3, $4, $5)',
        [cvId, 'core-values', JSON.stringify(itemData), i, item.isActive !== undefined ? item.isActive : true]
      );
    }

    await client.query('COMMIT');
    return res.json({ success: true, message: 'Đã cập nhật core values' });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
};

// ==================== MILESTONES ====================
exports.getMilestones = async (req, res, next) => {
  try {
    const section = await getSection('milestones');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const items = await getItems(section.id, 'milestones');

    return res.json({
      success: true,
      data: {
        id: section.id,
        headerTitle: data.headerTitle || '',
        headerDescription: data.headerDescription || '',
        items: items.map(i => {
          const itemData = i.data || {};
          return {
            id: i.id,
            year: itemData.year || '',
            title: itemData.title || '',
            description: itemData.description || '',
            icon: itemData.icon || '🚀',
            sortOrder: i.sort_order || 0,
            isActive: i.is_active !== undefined ? i.is_active : true,
          };
        }),
        isActive: section.is_active !== undefined ? section.is_active : true,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateMilestones = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { headerTitle, headerDescription, items = [], isActive } = req.body;

    const data = {
      headerTitle: headerTitle || '',
      headerDescription: headerDescription || '',
    };

    const section = await getSection('milestones');
    let msId;

    if (section) {
      msId = section.id;
      await client.query(
        'UPDATE about_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(data), isActive !== undefined ? isActive : true, msId]
      );
      await client.query('DELETE FROM about_section_items WHERE section_id = $1 AND section_type = $2', [msId, 'milestones']);
    } else {
      const { rows: inserted } = await client.query(
        'INSERT INTO about_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
        ['milestones', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
      msId = inserted[0].id;
    }

    // Insert items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemData = {
        year: item.year || '',
        title: item.title || '',
        description: item.description || '',
        icon: item.icon || '🚀',
      };
      await client.query(
        'INSERT INTO about_section_items (section_id, section_type, data, sort_order, is_active) VALUES ($1, $2, $3, $4, $5)',
        [msId, 'milestones', JSON.stringify(itemData), i, item.isActive !== undefined ? item.isActive : true]
      );
    }

    await client.query('COMMIT');
    return res.json({ success: true, message: 'Đã cập nhật milestones' });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
};

// ==================== LEADERSHIP ====================
exports.getLeadership = async (req, res, next) => {
  try {
    const section = await getSection('leadership');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const items = await getItems(section.id, 'leadership');

    return res.json({
      success: true,
      data: {
        id: section.id,
        headerTitle: data.headerTitle || '',
        headerDescription: data.headerDescription || '',
        items: items.map(i => {
          const itemData = i.data || {};
          return {
            id: i.id,
            name: itemData.name || '',
            position: itemData.position || '',
            email: itemData.email || '',
            phone: itemData.phone || '',
            description: itemData.description || '',
            image: itemData.image || '',
            sortOrder: i.sort_order || 0,
            isActive: i.is_active !== undefined ? i.is_active : true,
          };
        }),
        isActive: section.is_active !== undefined ? section.is_active : true,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateLeadership = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { headerTitle, headerDescription, items = [], isActive } = req.body;

    const data = {
      headerTitle: headerTitle || '',
      headerDescription: headerDescription || '',
    };

    const section = await getSection('leadership');
    let ldId;

    if (section) {
      ldId = section.id;
      await client.query(
        'UPDATE about_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(data), isActive !== undefined ? isActive : true, ldId]
      );
      await client.query('DELETE FROM about_section_items WHERE section_id = $1 AND section_type = $2', [ldId, 'leadership']);
    } else {
      const { rows: inserted } = await client.query(
        'INSERT INTO about_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
        ['leadership', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
      ldId = inserted[0].id;
    }

    // Insert items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemData = {
        name: item.name || '',
        position: item.position || '',
        email: item.email || '',
        phone: item.phone || '',
        description: item.description || '',
        image: item.image || '',
      };
      await client.query(
        'INSERT INTO about_section_items (section_id, section_type, data, sort_order, is_active) VALUES ($1, $2, $3, $4, $5)',
        [ldId, 'leadership', JSON.stringify(itemData), i, item.isActive !== undefined ? item.isActive : true]
      );
    }

    await client.query('COMMIT');
    return res.json({ success: true, message: 'Đã cập nhật leadership' });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
};
