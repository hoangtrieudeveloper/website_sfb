const { pool } = require('../config/database');

// ==================== HERO ====================
exports.getHero = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM career_sections WHERE section_type = $1 AND is_active = true',
      ['hero'],
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const section = rows[0];
    const data = section.data || {};
    return res.json({
      success: true,
      data: {
        id: section.id,
        titleLine1: data.titleLine1 || '',
        titleLine2: data.titleLine2 || '',
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
      description: description || '',
      buttonText: buttonText || '',
      buttonLink: buttonLink || '',
      image: image || '',
      backgroundGradient: backgroundGradient || '',
    };

    // Check if exists
    const { rows: existingRows } = await pool.query(
      'SELECT id FROM career_sections WHERE section_type = $1',
      ['hero'],
    );

    if (existingRows.length === 0) {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO career_sections (section_type, data, is_active)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [
          'hero',
          JSON.stringify(data),
          isActive !== undefined ? isActive : true,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          titleLine1: data.titleLine1,
          titleLine2: data.titleLine2,
          description: data.description,
          buttonText: data.buttonText,
          buttonLink: data.buttonLink,
          image: data.image,
          backgroundGradient: data.backgroundGradient,
          isActive: rows[0].is_active,
        },
      });
    } else {
      // Update existing
      const { rows } = await pool.query(
        `UPDATE career_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [
          JSON.stringify(data),
          isActive !== undefined ? isActive : true,
          existingRows[0].id,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          titleLine1: data.titleLine1,
          titleLine2: data.titleLine2,
          description: data.description,
          buttonText: data.buttonText,
          buttonLink: data.buttonLink,
          image: data.image,
          backgroundGradient: data.backgroundGradient,
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
    const { rows: sectionRows } = await pool.query(
      'SELECT * FROM career_sections WHERE section_type = $1 AND is_active = true',
      ['benefits'],
    );

    if (sectionRows.length === 0) {
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

    const section = sectionRows[0];
    const sectionData = section.data || {};
    const { rows: itemsRows } = await pool.query(
      'SELECT * FROM career_section_items WHERE section_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
      [section.id, 'benefits'],
    );

    return res.json({
      success: true,
      data: {
        headerTitle: sectionData.headerTitle || '',
        headerDescription: sectionData.headerDescription || '',
        items: itemsRows.map((item) => {
          const itemData = item.data || {};
          return {
            id: item.id,
            iconName: itemData.iconName || '',
            title: itemData.title || '',
            description: itemData.description || '',
            gradient: itemData.gradient || '',
            sortOrder: item.sort_order || 0,
            isActive: item.is_active !== undefined ? item.is_active : true,
          };
        }),
        isActive: section.is_active !== undefined ? section.is_active : true,
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
      'SELECT id FROM career_sections WHERE section_type = $1',
      ['benefits'],
    );

    let sectionId;
    if (existingRows.length === 0) {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO career_sections (section_type, data, is_active)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [
          'benefits',
          JSON.stringify({
            headerTitle: headerTitle || '',
            headerDescription: headerDescription || '',
          }),
          isActive !== undefined ? isActive : true,
        ],
      );
      sectionId = rows[0].id;
    } else {
      // Update existing
      sectionId = existingRows[0].id;
      await pool.query(
        `UPDATE career_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [
          JSON.stringify({
            headerTitle: headerTitle || '',
            headerDescription: headerDescription || '',
          }),
          isActive !== undefined ? isActive : true,
          sectionId,
        ],
      );
    }

    // Handle items
    if (Array.isArray(items)) {
      // Delete existing items
      await pool.query(
        'DELETE FROM career_section_items WHERE section_id = $1 AND section_type = $2',
        [sectionId, 'benefits'],
      );

      // Insert new items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await pool.query(
          `INSERT INTO career_section_items (section_id, section_type, data, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            sectionId,
            'benefits',
            JSON.stringify({
              iconName: item.iconName || '',
              title: item.title || '',
              description: item.description || '',
              gradient: item.gradient || '',
            }),
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
    const { rows: sectionRows } = await pool.query(
      'SELECT * FROM career_sections WHERE section_type = $1 AND is_active = true',
      ['positions'],
    );

    if (sectionRows.length === 0) {
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

    const section = sectionRows[0];
    const sectionData = section.data || {};
    const { rows: itemsRows } = await pool.query(
      'SELECT * FROM career_section_items WHERE section_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
      [section.id, 'positions'],
    );

    return res.json({
      success: true,
      data: {
        headerTitle: sectionData.headerTitle || '',
        headerDescription: sectionData.headerDescription || '',
        items: itemsRows.map((item) => {
          const itemData = item.data || {};
          return {
            id: item.id,
            title: itemData.title || '',
            department: itemData.department || '',
            type: itemData.type || '',
            location: itemData.location || '',
            salary: itemData.salary || '',
            experience: itemData.experience || '',
            description: itemData.description || '',
            skills: itemData.skills || [],
            gradient: itemData.gradient || '',
            sortOrder: item.sort_order || 0,
            isActive: item.is_active !== undefined ? item.is_active : true,
          };
        }),
        isActive: section.is_active !== undefined ? section.is_active : true,
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
      'SELECT id FROM career_sections WHERE section_type = $1',
      ['positions'],
    );

    let sectionId;
    if (existingRows.length === 0) {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO career_sections (section_type, data, is_active)
         VALUES ($1, $2, $3)
         RETURNING id`,
        [
          'positions',
          JSON.stringify({
            headerTitle: headerTitle || '',
            headerDescription: headerDescription || '',
          }),
          isActive !== undefined ? isActive : true,
        ],
      );
      sectionId = rows[0].id;
    } else {
      // Update existing
      sectionId = existingRows[0].id;
      await pool.query(
        `UPDATE career_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [
          JSON.stringify({
            headerTitle: headerTitle || '',
            headerDescription: headerDescription || '',
          }),
          isActive !== undefined ? isActive : true,
          sectionId,
        ],
      );
    }

    // Handle items
    if (Array.isArray(items)) {
      // Delete existing items
      await pool.query(
        'DELETE FROM career_section_items WHERE section_id = $1 AND section_type = $2',
        [sectionId, 'positions'],
      );

      // Insert new items
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await pool.query(
          `INSERT INTO career_section_items (section_id, section_type, data, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            sectionId,
            'positions',
            JSON.stringify({
              title: item.title || '',
              department: item.department || '',
              type: item.type || '',
              location: item.location || '',
              salary: item.salary || '',
              experience: item.experience || '',
              description: item.description || '',
              skills: item.skills || [],
              gradient: item.gradient || '',
            }),
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
      'SELECT * FROM career_sections WHERE section_type = $1 AND is_active = true',
      ['cta'],
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const section = rows[0];
    const data = section.data || {};
    return res.json({
      success: true,
      data: {
        id: section.id,
        title: data.title || '',
        description: data.description || '',
        primaryButtonText: data.primaryButtonText || '',
        primaryButtonLink: data.primaryButtonLink || '',
        secondaryButtonText: data.secondaryButtonText || '',
        secondaryButtonLink: data.secondaryButtonLink || '',
        backgroundGradient: data.backgroundGradient || '',
        isActive: section.is_active !== undefined ? section.is_active : true,
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

    const data = {
      title: title || '',
      description: description || '',
      primaryButtonText: primaryButtonText || '',
      primaryButtonLink: primaryButtonLink || '',
      secondaryButtonText: secondaryButtonText || '',
      secondaryButtonLink: secondaryButtonLink || '',
      backgroundGradient: backgroundGradient || '',
    };

    // Check if exists
    const { rows: existingRows } = await pool.query(
      'SELECT id FROM career_sections WHERE section_type = $1',
      ['cta'],
    );

    if (existingRows.length === 0) {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO career_sections (section_type, data, is_active)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [
          'cta',
          JSON.stringify(data),
          isActive !== undefined ? isActive : true,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          title: data.title,
          description: data.description,
          primaryButtonText: data.primaryButtonText,
          primaryButtonLink: data.primaryButtonLink,
          secondaryButtonText: data.secondaryButtonText,
          secondaryButtonLink: data.secondaryButtonLink,
          backgroundGradient: data.backgroundGradient,
          isActive: rows[0].is_active,
        },
      });
    } else {
      // Update existing
      const { rows } = await pool.query(
        `UPDATE career_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [
          JSON.stringify(data),
          isActive !== undefined ? isActive : true,
          existingRows[0].id,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          title: data.title,
          description: data.description,
          primaryButtonText: data.primaryButtonText,
          primaryButtonLink: data.primaryButtonLink,
          secondaryButtonText: data.secondaryButtonText,
          secondaryButtonLink: data.secondaryButtonLink,
          backgroundGradient: data.backgroundGradient,
          isActive: rows[0].is_active,
        },
      });
    }
  } catch (error) {
    return next(error);
  }
};
