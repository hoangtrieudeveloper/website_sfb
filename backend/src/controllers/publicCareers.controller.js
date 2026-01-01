const { pool } = require('../config/database');

// GET /api/public/careers/hero
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
        sectionType: 'hero',
        data: {
          titleLine1: data.titleLine1 || '',
          titleLine2: data.titleLine2 || '',
          description: data.description || '',
          buttonText: data.buttonText || '',
          buttonLink: data.buttonLink || '',
          image: data.image || '',
          backgroundGradient: data.backgroundGradient || '',
        },
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/careers/benefits
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
        },
      });
    }

    const section = sectionRows[0];
    const sectionData = section.data || {};
    const { rows: itemsRows } = await pool.query(
      'SELECT * FROM career_section_items WHERE section_id = $1 AND section_type = $2 AND is_active = true ORDER BY sort_order ASC',
      [section.id, 'benefits'],
    );

    return res.json({
      success: true,
      data: {
        id: section.id,
        sectionType: 'benefits',
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
        },
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/careers/positions
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
        },
      });
    }

    const section = sectionRows[0];
    const sectionData = section.data || {};
    const { rows: itemsRows } = await pool.query(
      'SELECT * FROM career_section_items WHERE section_id = $1 AND section_type = $2 AND is_active = true ORDER BY sort_order ASC',
      [section.id, 'positions'],
    );

    return res.json({
      success: true,
      data: {
        id: section.id,
        sectionType: 'positions',
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
        },
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/careers/cta
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
        sectionType: 'cta',
        data: {
          title: data.title || '',
          description: data.description || '',
          primaryButtonText: data.primaryButtonText || '',
          primaryButtonLink: data.primaryButtonLink || '',
          secondaryButtonText: data.secondaryButtonText || '',
          secondaryButtonLink: data.secondaryButtonLink || '',
          backgroundGradient: data.backgroundGradient || '',
        },
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

