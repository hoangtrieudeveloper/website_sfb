const { pool } = require('../config/database');

// Helper function to get section by type (only active)
const getSection = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM industries_sections WHERE section_type = $1 AND is_active = true',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Helper function to get items by section_id and section_type (only active)
const getItems = async (sectionId, sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM industries_section_items WHERE section_id = $1 AND section_type = $2 AND is_active = true ORDER BY sort_order ASC',
    [sectionId, sectionType]
  );
  return rows;
};

// GET /api/public/industries/hero
exports.getPublicHero = async (req, res, next) => {
  try {
    const section = await getSection('hero');
    
    if (!section || !section.is_active) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const stats = await getItems(section.id, 'hero');

    return res.json({
      success: true,
      data: {
        id: section.id,
        titlePrefix: data.titlePrefix || '',
        titleSuffix: data.titleSuffix || '',
        description: data.description || '',
        buttonText: data.buttonText || '',
        buttonLink: data.buttonLink || '',
        image: data.image || '',
        backgroundGradient: data.backgroundGradient || '',
        stats: stats.map(s => {
          const itemData = s.data || {};
          return {
            id: s.id,
            iconName: itemData.iconName || '',
            value: itemData.value || '',
            label: itemData.label || '',
            gradient: itemData.gradient || '',
            sortOrder: s.sort_order || 0,
          };
        }),
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/industries/list-header
exports.getPublicListHeader = async (req, res, next) => {
  try {
    const section = await getSection('list-header');
    
    if (!section || !section.is_active) {
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
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/industries/list
exports.getPublicIndustries = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, icon_name, title, short, points, gradient, sort_order
       FROM industries
       WHERE is_active = true
       ORDER BY sort_order ASC, id ASC`
    );

    return res.json({
      success: true,
      data: rows.map(row => ({
        id: row.id,
        iconName: row.icon_name || '',
        title: row.title,
        short: row.short || '',
        points: row.points || [],
        gradient: row.gradient || '',
        sortOrder: row.sort_order || 0,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/industries/process
exports.getPublicProcess = async (req, res, next) => {
  try {
    const section = await getSection('process-header');
    const steps = await pool.query(
      'SELECT * FROM industries_section_items WHERE section_type = $1 AND is_active = true ORDER BY sort_order ASC',
      ['process']
    );

    return res.json({
      success: true,
      data: {
        header: section && section.is_active ? {
          id: section.id,
          subtitle: section.data?.subtitle || '',
          titlePart1: section.data?.titlePart1 || '',
          titleHighlight: section.data?.titleHighlight || '',
          titlePart2: section.data?.titlePart2 || '',
        } : null,
        steps: steps.rows.map(s => {
          const itemData = s.data || {};
          return {
            id: s.id,
            stepId: itemData.stepId || '',
            iconName: itemData.iconName || '',
            title: itemData.title || '',
            description: itemData.description || '',
            points: itemData.points || [],
            image: itemData.image || '',
            colors: itemData.colors || {
              gradient: '',
              strip: '',
              border: '',
              shadowBase: '',
              shadowHover: '',
              check: '',
            },
            button: itemData.button || {
              text: '',
              link: '',
              iconName: '',
              iconSize: 18,
            },
            sortOrder: s.sort_order || 0,
          };
        }),
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/industries/cta
exports.getPublicCta = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, data, is_active
       FROM industries_sections 
       WHERE section_type = 'cta' AND is_active = true 
       ORDER BY id DESC LIMIT 1`
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const row = rows[0];
    const data = row.data || {};
    
    return res.json({
      success: true,
      data: {
        id: row.id,
        title: data.title || '',
        description: data.description || '',
        primaryButtonText: data.primaryButtonText || data.primary?.text || '',
        primaryButtonLink: data.primaryButtonLink || data.primary?.link || '',
        secondaryButtonText: data.secondaryButtonText || data.secondary?.text || '',
        secondaryButtonLink: data.secondaryButtonLink || data.secondary?.link || '',
        backgroundColor: data.backgroundColor || '#29A3DD',
      },
    });
  } catch (error) {
    return next(error);
  }
};

