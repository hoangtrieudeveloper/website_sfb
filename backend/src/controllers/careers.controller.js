const { pool } = require('../config/database');

// ==================== HERO ====================
exports.getHero = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM career_hero WHERE is_active = true ORDER BY id DESC LIMIT 1',
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
      description,
      buttonText,
      buttonLink,
      image,
      backgroundGradient,
      isActive,
    } = req.body;

    // Check if exists
    const { rows: existingRows } = await pool.query(
      'SELECT id FROM career_hero ORDER BY id DESC LIMIT 1',
    );

    if (existingRows.length === 0) {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO career_hero (title_line1, title_line2, description, button_text, button_link, image, background_gradient, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          titleLine1 || '',
          titleLine2 || '',
          description || '',
          buttonText || '',
          buttonLink || '',
          image || '',
          backgroundGradient || '',
          isActive !== undefined ? isActive : true,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          titleLine1: rows[0].title_line1 || '',
          titleLine2: rows[0].title_line2 || '',
          description: rows[0].description || '',
          buttonText: rows[0].button_text || '',
          buttonLink: rows[0].button_link || '',
          image: rows[0].image || '',
          backgroundGradient: rows[0].background_gradient || '',
          isActive: rows[0].is_active,
        },
      });
    } else {
      // Update existing
      const { rows } = await pool.query(
        `UPDATE career_hero
         SET title_line1 = $1, title_line2 = $2, description = $3, button_text = $4, button_link = $5, 
             image = $6, background_gradient = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [
          titleLine1 || '',
          titleLine2 || '',
          description || '',
          buttonText || '',
          buttonLink || '',
          image || '',
          backgroundGradient || '',
          isActive !== undefined ? isActive : true,
          existingRows[0].id,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          titleLine1: rows[0].title_line1 || '',
          titleLine2: rows[0].title_line2 || '',
          description: rows[0].description || '',
          buttonText: rows[0].button_text || '',
          buttonLink: rows[0].button_link || '',
          image: rows[0].image || '',
          backgroundGradient: rows[0].background_gradient || '',
          isActive: rows[0].is_active,
        },
      });
    }
  } catch (error) {
    return next(error);
  }
};

// ==================== BENEFITS ====================
exports.getBenefits = async (req, res, next) => {
  try {
    const { rows: benefitsRows } = await pool.query(
      'SELECT * FROM career_benefits WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (benefitsRows.length === 0) {
      return res.json({
        success: true,
        data: {
          headerTitle: '',
          headerDescription: '',
          items: [],
          isActive: true,
        },
      });
    }

    const benefits = benefitsRows[0];
    const { rows: itemsRows } = await pool.query(
      'SELECT * FROM career_benefits_items WHERE benefits_id = $1 ORDER BY sort_order ASC',
      [benefits.id],
    );

    return res.json({
      success: true,
      data: {
        headerTitle: benefits.header_title || '',
        headerDescription: benefits.header_description || '',
        items: itemsRows.map((item) => ({
          id: item.id,
          iconName: item.icon_name || '',
          title: item.title || '',
          description: item.description || '',
          gradient: item.gradient || '',
          sortOrder: item.sort_order || 0,
          isActive: item.is_active !== undefined ? item.is_active : true,
        })),
        isActive: benefits.is_active !== undefined ? benefits.is_active : true,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateBenefits = async (req, res, next) => {
  try {
    const { headerTitle, headerDescription, items, isActive } = req.body;

    // Check if exists
    const { rows: existingRows } = await pool.query(
      'SELECT id FROM career_benefits ORDER BY id DESC LIMIT 1',
    );

    let benefitsId;
    if (existingRows.length === 0) {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO career_benefits (header_title, header_description, is_active)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [
          headerTitle || '',
          headerDescription || '',
          isActive !== undefined ? isActive : true,
        ],
      );
      benefitsId = rows[0].id;
    } else {
      // Update existing
      benefitsId = existingRows[0].id;
      await pool.query(
        `UPDATE career_benefits
         SET header_title = $1, header_description = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [
          headerTitle || '',
          headerDescription || '',
          isActive !== undefined ? isActive : true,
          benefitsId,
        ],
      );
    }

    // Handle items
    if (Array.isArray(items)) {
      // Delete existing items
      await pool.query('DELETE FROM career_benefits_items WHERE benefits_id = $1', [benefitsId]);

      // Insert new items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await pool.query(
          `INSERT INTO career_benefits_items (benefits_id, icon_name, title, description, gradient, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            benefitsId,
            item.iconName || '',
            item.title || '',
            item.description || '',
            item.gradient || '',
            item.sortOrder !== undefined ? item.sortOrder : i,
            item.isActive !== undefined ? item.isActive : true,
          ],
        );
      }
    }

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

// ==================== POSITIONS ====================
exports.getPositions = async (req, res, next) => {
  try {
    const { rows: positionsRows } = await pool.query(
      'SELECT * FROM career_positions WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (positionsRows.length === 0) {
      return res.json({
        success: true,
        data: {
          headerTitle: '',
          headerDescription: '',
          items: [],
          isActive: true,
        },
      });
    }

    const positions = positionsRows[0];
    const { rows: itemsRows } = await pool.query(
      'SELECT * FROM career_positions_items WHERE positions_id = $1 ORDER BY sort_order ASC',
      [positions.id],
    );

    return res.json({
      success: true,
      data: {
        headerTitle: positions.header_title || '',
        headerDescription: positions.header_description || '',
        items: itemsRows.map((item) => ({
          id: item.id,
          title: item.title || '',
          department: item.department || '',
          type: item.type || '',
          location: item.location || '',
          salary: item.salary || '',
          experience: item.experience || '',
          description: item.description || '',
          skills: item.skills || [],
          gradient: item.gradient || '',
          sortOrder: item.sort_order || 0,
          isActive: item.is_active !== undefined ? item.is_active : true,
        })),
        isActive: positions.is_active !== undefined ? positions.is_active : true,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updatePositions = async (req, res, next) => {
  try {
    const { headerTitle, headerDescription, items, isActive } = req.body;

    // Check if exists
    const { rows: existingRows } = await pool.query(
      'SELECT id FROM career_positions ORDER BY id DESC LIMIT 1',
    );

    let positionsId;
    if (existingRows.length === 0) {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO career_positions (header_title, header_description, is_active)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [
          headerTitle || '',
          headerDescription || '',
          isActive !== undefined ? isActive : true,
        ],
      );
      positionsId = rows[0].id;
    } else {
      // Update existing
      positionsId = existingRows[0].id;
      await pool.query(
        `UPDATE career_positions
         SET header_title = $1, header_description = $2, is_active = $3, updated_at = CURRENT_TIMESTAMP
         WHERE id = $4`,
        [
          headerTitle || '',
          headerDescription || '',
          isActive !== undefined ? isActive : true,
          positionsId,
        ],
      );
    }

    // Handle items
    if (Array.isArray(items)) {
      // Delete existing items
      await pool.query('DELETE FROM career_positions_items WHERE positions_id = $1', [positionsId]);

      // Insert new items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await pool.query(
          `INSERT INTO career_positions_items (positions_id, title, department, type, location, salary, experience, description, skills, gradient, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            positionsId,
            item.title || '',
            item.department || '',
            item.type || '',
            item.location || '',
            item.salary || '',
            item.experience || '',
            item.description || '',
            JSON.stringify(item.skills || []),
            item.gradient || '',
            item.sortOrder !== undefined ? item.sortOrder : i,
            item.isActive !== undefined ? item.isActive : true,
          ],
        );
      }
    }

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
};

// ==================== CTA ====================
exports.getCTA = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM career_cta WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const cta = rows[0];
    return res.json({
      success: true,
      data: {
        id: cta.id,
        title: cta.title || '',
        description: cta.description || '',
        primaryButtonText: cta.primary_button_text || '',
        primaryButtonLink: cta.primary_button_link || '',
        secondaryButtonText: cta.secondary_button_text || '',
        secondaryButtonLink: cta.secondary_button_link || '',
        backgroundGradient: cta.background_gradient || '',
        isActive: cta.is_active !== undefined ? cta.is_active : true,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateCTA = async (req, res, next) => {
  try {
    const {
      title,
      description,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
      backgroundGradient,
      isActive,
    } = req.body;

    // Check if exists
    const { rows: existingRows } = await pool.query(
      'SELECT id FROM career_cta ORDER BY id DESC LIMIT 1',
    );

    if (existingRows.length === 0) {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO career_cta (title, description, primary_button_text, primary_button_link, secondary_button_text, secondary_button_link, background_gradient, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          title || '',
          description || '',
          primaryButtonText || '',
          primaryButtonLink || '',
          secondaryButtonText || '',
          secondaryButtonLink || '',
          backgroundGradient || '',
          isActive !== undefined ? isActive : true,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          title: rows[0].title || '',
          description: rows[0].description || '',
          primaryButtonText: rows[0].primary_button_text || '',
          primaryButtonLink: rows[0].primary_button_link || '',
          secondaryButtonText: rows[0].secondary_button_text || '',
          secondaryButtonLink: rows[0].secondary_button_link || '',
          backgroundGradient: rows[0].background_gradient || '',
          isActive: rows[0].is_active,
        },
      });
    } else {
      // Update existing
      const { rows } = await pool.query(
        `UPDATE career_cta
         SET title = $1, description = $2, primary_button_text = $3, primary_button_link = $4,
             secondary_button_text = $5, secondary_button_link = $6, background_gradient = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP
         WHERE id = $9
         RETURNING *`,
        [
          title || '',
          description || '',
          primaryButtonText || '',
          primaryButtonLink || '',
          secondaryButtonText || '',
          secondaryButtonLink || '',
          backgroundGradient || '',
          isActive !== undefined ? isActive : true,
          existingRows[0].id,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          title: rows[0].title || '',
          description: rows[0].description || '',
          primaryButtonText: rows[0].primary_button_text || '',
          primaryButtonLink: rows[0].primary_button_link || '',
          secondaryButtonText: rows[0].secondary_button_text || '',
          secondaryButtonLink: rows[0].secondary_button_link || '',
          backgroundGradient: rows[0].background_gradient || '',
          isActive: rows[0].is_active,
        },
      });
    }
  } catch (error) {
    return next(error);
  }
};

