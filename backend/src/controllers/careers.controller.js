const { pool } = require('../config/database');

// Helper function to get section by type (any status) - for admin
const getSectionAnyStatus = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM career_sections WHERE section_type = $1',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// ==================== HERO ====================
exports.getHero = async (req, res, next) => {
  try {
    // For admin, get section with any status
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

    const section = await getSectionAnyStatus('hero');

    if (section) {
      // Update existing - preserve existing data if new data is empty
      const existingData = section.data || {};
      const dataToUpdate = {
        titleLine1: titleLine1 !== undefined && titleLine1 !== '' ? titleLine1 : (existingData.titleLine1 || ''),
        titleLine2: titleLine2 !== undefined && titleLine2 !== '' ? titleLine2 : (existingData.titleLine2 || ''),
        description: description !== undefined && description !== '' ? description : (existingData.description || ''),
        buttonText: buttonText !== undefined && buttonText !== '' ? buttonText : (existingData.buttonText || ''),
        buttonLink: buttonLink !== undefined && buttonLink !== '' ? buttonLink : (existingData.buttonLink || ''),
        image: image !== undefined && image !== '' ? image : (existingData.image || ''),
        backgroundGradient: backgroundGradient !== undefined && backgroundGradient !== '' ? backgroundGradient : (existingData.backgroundGradient || ''),
      };

      const { rows } = await pool.query(
        `UPDATE career_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [
          JSON.stringify(dataToUpdate),
          isActive !== undefined ? isActive : true,
          section.id,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          titleLine1: dataToUpdate.titleLine1,
          titleLine2: dataToUpdate.titleLine2,
          description: dataToUpdate.description,
          buttonText: dataToUpdate.buttonText,
          buttonLink: dataToUpdate.buttonLink,
          image: dataToUpdate.image,
          backgroundGradient: dataToUpdate.backgroundGradient,
          isActive: rows[0].is_active,
        },
      });
    } else {
      // Create new
      const dataToInsert = {
        titleLine1: titleLine1 || '',
        titleLine2: titleLine2 || '',
        description: description || '',
        buttonText: buttonText || '',
        buttonLink: buttonLink || '',
        image: image || '',
        backgroundGradient: backgroundGradient || '',
      };

      const { rows } = await pool.query(
        `INSERT INTO career_sections (section_type, data, is_active)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [
          'hero',
          JSON.stringify(dataToInsert),
          isActive !== undefined ? isActive : true,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          titleLine1: dataToInsert.titleLine1,
          titleLine2: dataToInsert.titleLine2,
          description: dataToInsert.description,
          buttonText: dataToInsert.buttonText,
          buttonLink: dataToInsert.buttonLink,
          image: dataToInsert.image,
          backgroundGradient: dataToInsert.backgroundGradient,
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
    // For admin, get section with any status
    const section = await getSectionAnyStatus('benefits');

    if (!section) {
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

    const section = await getSectionAnyStatus('benefits');

    let sectionId;
    if (section) {
      // Update existing - preserve existing data if new data is empty
      sectionId = section.id;
      const existingData = section.data || {};
      const dataToUpdate = {
        headerTitle: headerTitle !== undefined && headerTitle !== '' ? headerTitle : (existingData.headerTitle || ''),
        headerDescription: headerDescription !== undefined && headerDescription !== '' ? headerDescription : (existingData.headerDescription || ''),
      };
      await pool.query(
        `UPDATE career_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [
          JSON.stringify(dataToUpdate),
          isActive !== undefined ? isActive : true,
          sectionId,
        ],
      );
    } else {
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
    // For admin, get section with any status
    const section = await getSectionAnyStatus('positions');

    if (!section) {
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

    const section = await getSectionAnyStatus('positions');

    let sectionId;
    if (section) {
      // Update existing - preserve existing data if new data is empty
      sectionId = section.id;
      const existingData = section.data || {};
      const dataToUpdate = {
        headerTitle: headerTitle !== undefined && headerTitle !== '' ? headerTitle : (existingData.headerTitle || ''),
        headerDescription: headerDescription !== undefined && headerDescription !== '' ? headerDescription : (existingData.headerDescription || ''),
      };
      await pool.query(
        `UPDATE career_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [
          JSON.stringify(dataToUpdate),
          isActive !== undefined ? isActive : true,
          sectionId,
        ],
      );
    } else {
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
    // For admin, get section with any status
    const section = await getSectionAnyStatus('cta');

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

    const section = await getSectionAnyStatus('cta');

    if (section) {
      // Update existing - preserve existing data if new data is empty
      const existingData = section.data || {};
      const dataToUpdate = {
        title: title !== undefined && title !== '' ? title : (existingData.title || ''),
        description: description !== undefined && description !== '' ? description : (existingData.description || ''),
        primaryButtonText: primaryButtonText !== undefined && primaryButtonText !== '' ? primaryButtonText : (existingData.primaryButtonText || ''),
        primaryButtonLink: primaryButtonLink !== undefined && primaryButtonLink !== '' ? primaryButtonLink : (existingData.primaryButtonLink || ''),
        secondaryButtonText: secondaryButtonText !== undefined && secondaryButtonText !== '' ? secondaryButtonText : (existingData.secondaryButtonText || ''),
        secondaryButtonLink: secondaryButtonLink !== undefined && secondaryButtonLink !== '' ? secondaryButtonLink : (existingData.secondaryButtonLink || ''),
        backgroundGradient: backgroundGradient !== undefined && backgroundGradient !== '' ? backgroundGradient : (existingData.backgroundGradient || ''),
      };

      const { rows } = await pool.query(
        `UPDATE career_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [
          JSON.stringify(dataToUpdate),
          isActive !== undefined ? isActive : true,
          section.id,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          title: dataToUpdate.title,
          description: dataToUpdate.description,
          primaryButtonText: dataToUpdate.primaryButtonText,
          primaryButtonLink: dataToUpdate.primaryButtonLink,
          secondaryButtonText: dataToUpdate.secondaryButtonText,
          secondaryButtonLink: dataToUpdate.secondaryButtonLink,
          backgroundGradient: dataToUpdate.backgroundGradient,
          isActive: rows[0].is_active,
        },
      });
    } else {
      // Create new
      const dataToInsert = {
        title: title || '',
        description: description || '',
        primaryButtonText: primaryButtonText || '',
        primaryButtonLink: primaryButtonLink || '',
        secondaryButtonText: secondaryButtonText || '',
        secondaryButtonLink: secondaryButtonLink || '',
        backgroundGradient: backgroundGradient || '',
      };

      const { rows } = await pool.query(
        `INSERT INTO career_sections (section_type, data, is_active)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [
          'cta',
          JSON.stringify(dataToInsert),
          isActive !== undefined ? isActive : true,
        ],
      );

      return res.json({
        success: true,
        data: {
          id: rows[0].id,
          title: dataToInsert.title,
          description: dataToInsert.description,
          primaryButtonText: dataToInsert.primaryButtonText,
          primaryButtonLink: dataToInsert.primaryButtonLink,
          secondaryButtonText: dataToInsert.secondaryButtonText,
          secondaryButtonLink: dataToInsert.secondaryButtonLink,
          backgroundGradient: dataToInsert.backgroundGradient,
          isActive: rows[0].is_active,
        },
      });
    }
  } catch (error) {
    return next(error);
  }
};
