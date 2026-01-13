const { pool } = require('../config/database');
const { applyLocaleToData, getLocaleFromRequest } = require('../utils/locale');

// Helper function to parse locale field from JSON string
const parseLocaleField = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object' && parsed !== null && ('vi' in parsed || 'en' in parsed || 'ja' in parsed)) {
        return parsed;
      }
    } catch (e) {
      // Not JSON, return as string
    }
    return value;
  }
  if (typeof value === 'object' && value !== null && ('vi' in value || 'en' in value || 'ja' in value)) {
    return value;
  }
  return value;
};

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
    const currentLocale = getLocaleFromRequest(req);
    const section = await getSection('hero');
    
    if (!section || !section.is_active) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const rawData = section.data || {};
    const stats = await getItems(section.id, 'hero');

    // Parse locale fields
    const parsedData = {
      titlePrefix: parseLocaleField(rawData.titlePrefix || ''),
      titleSuffix: parseLocaleField(rawData.titleSuffix || ''),
      description: parseLocaleField(rawData.description || ''),
      buttonText: parseLocaleField(rawData.buttonText || ''),
      buttonLink: rawData.buttonLink || '',
      image: rawData.image || '',
      backgroundGradient: rawData.backgroundGradient || '',
      stats: stats.map(s => {
        const itemData = s.data || {};
        return {
          id: s.id,
          iconName: itemData.iconName || '',
          value: itemData.value || '',
          label: parseLocaleField(itemData.label || ''),
          gradient: itemData.gradient || '',
          sortOrder: s.sort_order || 0,
        };
      }),
    };
    
    // Apply locale to get strings
    const localizedData = applyLocaleToData(parsedData, currentLocale);

    return res.json({
      success: true,
      data: {
        id: section.id,
        titlePrefix: localizedData.titlePrefix || '',
        titleSuffix: localizedData.titleSuffix || '',
        description: localizedData.description || '',
        buttonText: localizedData.buttonText || '',
        buttonLink: localizedData.buttonLink || '',
        image: localizedData.image || '',
        backgroundGradient: localizedData.backgroundGradient || '',
        stats: localizedData.stats || [],
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/industries/list-header
exports.getPublicListHeader = async (req, res, next) => {
  try {
    const currentLocale = getLocaleFromRequest(req);
    const section = await getSection('list-header');
    
    if (!section || !section.is_active) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const rawData = section.data || {};
    // Parse locale fields
    const parsedData = {
      title: parseLocaleField(rawData.title || ''),
      description: parseLocaleField(rawData.description || ''),
    };
    
    // Apply locale to get strings
    const localizedData = applyLocaleToData(parsedData, currentLocale);
    
    return res.json({
      success: true,
      data: {
        id: section.id,
        title: localizedData.title || '',
        description: localizedData.description || '',
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/industries/list
exports.getPublicIndustries = async (req, res, next) => {
  try {
    const currentLocale = getLocaleFromRequest(req);
    const { rows } = await pool.query(
      `SELECT id, icon_name, title, short, points, gradient, sort_order
       FROM industries
       WHERE is_active = true
       ORDER BY sort_order ASC, id ASC`
    );

    // Parse and localize each industry
    const localizedIndustries = rows.map(row => {
      // Parse locale fields
      const rawTitle = parseLocaleField(row.title);
      const rawShort = parseLocaleField(row.short || '');
      // Parse points - could be array or JSON string
      let rawPoints = [];
      if (Array.isArray(row.points)) {
        rawPoints = row.points.map(p => parseLocaleField(p));
      } else if (row.points) {
        try {
          const parsed = JSON.parse(row.points);
          if (Array.isArray(parsed)) {
            rawPoints = parsed.map(p => parseLocaleField(p));
          }
        } catch (e) {
          // Not JSON, ignore
        }
      }
      
      // Build raw data object
      const rawData = {
        id: row.id,
        iconName: row.icon_name || '',
        title: rawTitle,
        short: rawShort,
        points: rawPoints,
        gradient: row.gradient || '',
        sortOrder: row.sort_order || 0,
      };
      
      // Apply locale to get strings
      return applyLocaleToData(rawData, currentLocale);
    });

    return res.json({
      success: true,
      data: localizedIndustries,
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/industries/process
exports.getPublicProcess = async (req, res, next) => {
  try {
    const currentLocale = getLocaleFromRequest(req);
    const section = await getSection('process-header');
    const steps = await pool.query(
      'SELECT * FROM industries_section_items WHERE section_type = $1 AND is_active = true ORDER BY sort_order ASC',
      ['process']
    );

    // Parse and localize header
    let localizedHeader = null;
    if (section && section.is_active) {
      const rawHeaderData = section.data || {};
      const parsedHeader = {
        subtitle: parseLocaleField(rawHeaderData.subtitle || ''),
        titlePart1: parseLocaleField(rawHeaderData.titlePart1 || ''),
        titleHighlight: parseLocaleField(rawHeaderData.titleHighlight || ''),
        titlePart2: parseLocaleField(rawHeaderData.titlePart2 || ''),
      };
      localizedHeader = {
        id: section.id,
        ...applyLocaleToData(parsedHeader, currentLocale),
      };
    }

    // Parse and localize steps
    const localizedSteps = steps.rows.map(s => {
      const itemData = s.data || {};
      const parsedStep = {
        stepId: itemData.stepId || '',
        iconName: itemData.iconName || '',
        title: parseLocaleField(itemData.title || ''),
        description: parseLocaleField(itemData.description || ''),
        points: Array.isArray(itemData.points) 
          ? itemData.points.map(p => parseLocaleField(p))
          : [],
        image: itemData.image || '',
        colors: itemData.colors || {
          gradient: '',
          strip: '',
          border: '',
          shadowBase: '',
          shadowHover: '',
          check: '',
        },
        button: itemData.button ? {
          text: parseLocaleField(itemData.button.text || ''),
          link: itemData.button.link || '',
          iconName: itemData.button.iconName || '',
          iconSize: itemData.button.iconSize || 18,
        } : {
          text: '',
          link: '',
          iconName: '',
          iconSize: 18,
        },
        sortOrder: s.sort_order || 0,
      };
      
      return {
        id: s.id,
        ...applyLocaleToData(parsedStep, currentLocale),
      };
    });

    return res.json({
      success: true,
      data: {
        header: localizedHeader,
        steps: localizedSteps,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/industries/cta
exports.getPublicCta = async (req, res, next) => {
  try {
    const currentLocale = getLocaleFromRequest(req);
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
    const rawData = row.data || {};
    
    // Parse locale fields
    const parsedData = {
      title: parseLocaleField(rawData.title || ''),
      description: parseLocaleField(rawData.description || ''),
      primaryButtonText: parseLocaleField(rawData.primaryButtonText || rawData.primary?.text || ''),
      primaryButtonLink: rawData.primaryButtonLink || rawData.primary?.link || '',
      secondaryButtonText: parseLocaleField(rawData.secondaryButtonText || rawData.secondary?.text || ''),
      secondaryButtonLink: rawData.secondaryButtonLink || rawData.secondary?.link || '',
      backgroundColor: rawData.backgroundColor || '#29A3DD',
    };
    
    // Apply locale to get strings
    const localizedData = applyLocaleToData(parsedData, currentLocale);
    
    return res.json({
      success: true,
      data: {
        id: row.id,
        title: localizedData.title || '',
        description: localizedData.description || '',
        primaryButtonText: localizedData.primaryButtonText || '',
        primaryButtonLink: localizedData.primaryButtonLink || '',
        secondaryButtonText: localizedData.secondaryButtonText || '',
        secondaryButtonLink: localizedData.secondaryButtonLink || '',
        backgroundColor: localizedData.backgroundColor || '#29A3DD',
      },
    });
  } catch (error) {
    return next(error);
  }
};

