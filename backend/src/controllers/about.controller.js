const { pool } = require('../config/database');

// ==================== HERO ====================
exports.getHero = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM about_hero WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const hero = rows[0];
    return res.json({
      success: true,
      data: {
        id: hero.id,
        titleLine1: hero.title_line1 || '',
        titleLine2: hero.title_line2 || '',
        titleLine3: hero.title_line3 || '',
        description: hero.description || '',
        buttonText: hero.button_text || '',
        buttonLink: hero.button_link || '',
        image: hero.image || '',
        backgroundGradient: hero.background_gradient || '',
        isActive: hero.is_active !== undefined ? hero.is_active : true,
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

    // Check if exists
    const { rows: existing } = await pool.query(
      'SELECT id FROM about_hero WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (existing.length > 0) {
      // Update
      await pool.query(
        `UPDATE about_hero SET
          title_line1 = $1, title_line2 = $2, title_line3 = $3,
          description = $4, button_text = $5, button_link = $6,
          image = $7, background_gradient = $8, is_active = $9
        WHERE id = $10`,
        [
          titleLine1,
          titleLine2,
          titleLine3,
          description,
          buttonText,
          buttonLink,
          image,
          backgroundGradient,
          isActive !== undefined ? isActive : true,
          existing[0].id,
        ],
      );
    } else {
      // Insert
      await pool.query(
        `INSERT INTO about_hero (
          title_line1, title_line2, title_line3, description,
          button_text, button_link, image, background_gradient, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          titleLine1,
          titleLine2,
          titleLine3,
          description,
          buttonText,
          buttonLink,
          image,
          backgroundGradient,
          isActive !== undefined ? isActive : true,
        ],
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
    const { rows } = await pool.query(
      'SELECT * FROM about_company WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const company = rows[0];

    // Get contacts
    const { rows: contacts } = await pool.query(
      'SELECT * FROM about_company_contacts WHERE company_id = $1 ORDER BY sort_order ASC',
      [company.id],
    );

    return res.json({
      success: true,
      data: {
        id: company.id,
        headerSub: company.header_sub || '',
        headerTitleLine1: company.header_title_line1 || '',
        headerTitleLine2: company.header_title_line2 || '',
        contentImage1: company.content_image1 || '',
        contentTitle: company.content_title || '',
        contentDescription: company.content_description || '',
        contentButtonText: company.content_button_text || '',
        contentButtonLink: company.content_button_link || '',
        contactImage2: company.contact_image2 || '',
        contactButtonText: company.contact_button_text || '',
        contactButtonLink: company.contact_button_link || '',
        contacts: contacts.map(c => ({
          id: c.id,
          iconName: c.icon_name || 'Building2',
          title: c.title || '',
          text: c.text || '',
          isHighlight: c.is_highlight || false,
          sortOrder: c.sort_order || 0,
        })),
        isActive: company.is_active !== undefined ? company.is_active : true,
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

    // Check if exists
    const { rows: existing } = await client.query(
      'SELECT id FROM about_company WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    let companyId;
    if (existing.length > 0) {
      companyId = existing[0].id;
      // Update
      await client.query(
        `UPDATE about_company SET
          header_sub = $1, header_title_line1 = $2, header_title_line2 = $3,
          content_image1 = $4, content_title = $5, content_description = $6,
          content_button_text = $7, content_button_link = $8,
          contact_image2 = $9, contact_button_text = $10, contact_button_link = $11,
          is_active = $12
        WHERE id = $13`,
        [
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
          isActive !== undefined ? isActive : true,
          companyId,
        ],
      );

      // Delete old contacts
      await client.query('DELETE FROM about_company_contacts WHERE company_id = $1', [companyId]);
    } else {
      // Insert
      const { rows: inserted } = await client.query(
        `INSERT INTO about_company (
          header_sub, header_title_line1, header_title_line2,
          content_image1, content_title, content_description,
          content_button_text, content_button_link,
          contact_image2, contact_button_text, contact_button_link, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
        [
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
          isActive !== undefined ? isActive : true,
        ],
      );
      companyId = inserted[0].id;
    }

    // Insert contacts
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      await client.query(
        `INSERT INTO about_company_contacts (
          company_id, icon_name, title, text, is_highlight, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          companyId,
          contact.iconName || 'Building2',
          contact.title || '',
          contact.text || '',
          contact.isHighlight || false,
          i,
        ],
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
    const { rows } = await pool.query(
      'SELECT * FROM about_vision_mission WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const vm = rows[0];

    // Get items
    const { rows: items } = await pool.query(
      'SELECT * FROM about_vision_mission_items WHERE vision_mission_id = $1 ORDER BY sort_order ASC',
      [vm.id],
    );

    return res.json({
      success: true,
      data: {
        id: vm.id,
        headerTitle: vm.header_title || '',
        headerDescription: vm.header_description || '',
        items: items.map(i => ({
          id: i.id,
          text: i.text || '',
          sortOrder: i.sort_order || 0,
        })),
        isActive: vm.is_active !== undefined ? vm.is_active : true,
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

    // Check if exists
    const { rows: existing } = await client.query(
      'SELECT id FROM about_vision_mission WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    let vmId;
    if (existing.length > 0) {
      vmId = existing[0].id;
      await client.query(
        `UPDATE about_vision_mission SET
          header_title = $1, header_description = $2, is_active = $3
        WHERE id = $4`,
        [headerTitle, headerDescription, isActive !== undefined ? isActive : true, vmId],
      );
      await client.query('DELETE FROM about_vision_mission_items WHERE vision_mission_id = $1', [vmId]);
    } else {
      const { rows: inserted } = await client.query(
        `INSERT INTO about_vision_mission (header_title, header_description, is_active)
        VALUES ($1, $2, $3) RETURNING id`,
        [headerTitle, headerDescription, isActive !== undefined ? isActive : true],
      );
      vmId = inserted[0].id;
    }

    // Insert items
    for (let i = 0; i < items.length; i++) {
      await client.query(
        `INSERT INTO about_vision_mission_items (vision_mission_id, text, sort_order)
        VALUES ($1, $2, $3)`,
        [vmId, items[i].text || '', i],
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
    const { rows } = await pool.query(
      'SELECT * FROM about_core_values WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const cv = rows[0];

    // Get items
    const { rows: items } = await pool.query(
      'SELECT * FROM about_core_values_items WHERE core_values_id = $1 ORDER BY sort_order ASC',
      [cv.id],
    );

    return res.json({
      success: true,
      data: {
        id: cv.id,
        headerTitle: cv.header_title || '',
        headerDescription: cv.header_description || '',
        items: items.map(i => ({
          id: i.id,
          iconName: i.icon_name || 'Lightbulb',
          title: i.title || '',
          description: i.description || '',
          gradient: i.gradient || '',
          sortOrder: i.sort_order || 0,
          isActive: i.is_active !== undefined ? i.is_active : true,
        })),
        isActive: cv.is_active !== undefined ? cv.is_active : true,
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

    // Check if exists
    const { rows: existing } = await client.query(
      'SELECT id FROM about_core_values WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    let cvId;
    if (existing.length > 0) {
      cvId = existing[0].id;
      await client.query(
        `UPDATE about_core_values SET
          header_title = $1, header_description = $2, is_active = $3
        WHERE id = $4`,
        [headerTitle, headerDescription, isActive !== undefined ? isActive : true, cvId],
      );
      await client.query('DELETE FROM about_core_values_items WHERE core_values_id = $1', [cvId]);
    } else {
      const { rows: inserted } = await client.query(
        `INSERT INTO about_core_values (header_title, header_description, is_active)
        VALUES ($1, $2, $3) RETURNING id`,
        [headerTitle, headerDescription, isActive !== undefined ? isActive : true],
      );
      cvId = inserted[0].id;
    }

    // Insert items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await client.query(
        `INSERT INTO about_core_values_items (
          core_values_id, icon_name, title, description, gradient, sort_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          cvId,
          item.iconName || 'Lightbulb',
          item.title || '',
          item.description || '',
          item.gradient || '',
          i,
          item.isActive !== undefined ? item.isActive : true,
        ],
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
    const { rows } = await pool.query(
      'SELECT * FROM about_milestones WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const ms = rows[0];

    // Get items
    const { rows: items } = await pool.query(
      'SELECT * FROM about_milestones_items WHERE milestones_id = $1 ORDER BY sort_order ASC',
      [ms.id],
    );

    return res.json({
      success: true,
      data: {
        id: ms.id,
        headerTitle: ms.header_title || '',
        headerDescription: ms.header_description || '',
        items: items.map(i => ({
          id: i.id,
          year: i.year || '',
          title: i.title || '',
          description: i.description || '',
          icon: i.icon || '🚀',
          sortOrder: i.sort_order || 0,
          isActive: i.is_active !== undefined ? i.is_active : true,
        })),
        isActive: ms.is_active !== undefined ? ms.is_active : true,
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

    // Check if exists
    const { rows: existing } = await client.query(
      'SELECT id FROM about_milestones WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    let msId;
    if (existing.length > 0) {
      msId = existing[0].id;
      await client.query(
        `UPDATE about_milestones SET
          header_title = $1, header_description = $2, is_active = $3
        WHERE id = $4`,
        [headerTitle, headerDescription, isActive !== undefined ? isActive : true, msId],
      );
      await client.query('DELETE FROM about_milestones_items WHERE milestones_id = $1', [msId]);
    } else {
      const { rows: inserted } = await client.query(
        `INSERT INTO about_milestones (header_title, header_description, is_active)
        VALUES ($1, $2, $3) RETURNING id`,
        [headerTitle, headerDescription, isActive !== undefined ? isActive : true],
      );
      msId = inserted[0].id;
    }

    // Insert items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await client.query(
        `INSERT INTO about_milestones_items (
          milestones_id, year, title, description, icon, sort_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          msId,
          item.year || '',
          item.title || '',
          item.description || '',
          item.icon || '🚀',
          i,
          item.isActive !== undefined ? item.isActive : true,
        ],
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
    const { rows } = await pool.query(
      'SELECT * FROM about_leadership WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const ld = rows[0];

    // Get items
    const { rows: items } = await pool.query(
      'SELECT * FROM about_leadership_items WHERE leadership_id = $1 ORDER BY sort_order ASC',
      [ld.id],
    );

    return res.json({
      success: true,
      data: {
        id: ld.id,
        headerTitle: ld.header_title || '',
        headerDescription: ld.header_description || '',
        items: items.map(i => ({
          id: i.id,
          name: i.name || '',
          position: i.position || '',
          email: i.email || '',
          phone: i.phone || '',
          description: i.description || '',
          image: i.image || '',
          sortOrder: i.sort_order || 0,
          isActive: i.is_active !== undefined ? i.is_active : true,
        })),
        isActive: ld.is_active !== undefined ? ld.is_active : true,
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

    // Check if exists
    const { rows: existing } = await client.query(
      'SELECT id FROM about_leadership WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    let ldId;
    if (existing.length > 0) {
      ldId = existing[0].id;
      await client.query(
        `UPDATE about_leadership SET
          header_title = $1, header_description = $2, is_active = $3
        WHERE id = $4`,
        [headerTitle, headerDescription, isActive !== undefined ? isActive : true, ldId],
      );
      await client.query('DELETE FROM about_leadership_items WHERE leadership_id = $1', [ldId]);
    } else {
      const { rows: inserted } = await client.query(
        `INSERT INTO about_leadership (header_title, header_description, is_active)
        VALUES ($1, $2, $3) RETURNING id`,
        [headerTitle, headerDescription, isActive !== undefined ? isActive : true],
      );
      ldId = inserted[0].id;
    }

    // Insert items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      await client.query(
        `INSERT INTO about_leadership_items (
          leadership_id, name, position, email, phone, description, image, sort_order, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          ldId,
          item.name || '',
          item.position || '',
          item.email || '',
          item.phone || '',
          item.description || '',
          item.image || '',
          i,
          item.isActive !== undefined ? item.isActive : true,
        ],
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

