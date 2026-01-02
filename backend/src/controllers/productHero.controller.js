const { pool } = require('../config/database');

// Helper function to get section regardless of is_active status (for admin)
const getSectionAnyStatus = async (sectionType) => {
  const { rows } = await pool.query(
    `SELECT id, data, is_active, created_at, updated_at 
     FROM products_sections 
     WHERE section_type = $1 
     ORDER BY id DESC LIMIT 1`,
    [sectionType],
  );
  return rows.length > 0 ? rows[0] : null;
};

// GET /api/admin/products/hero
exports.getHero = async (req, res, next) => {
  try {
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
        title: data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        primaryCtaText: data.primaryCtaText || '',
        primaryCtaLink: data.primaryCtaLink || '',
        secondaryCtaText: data.secondaryCtaText || '',
        secondaryCtaLink: data.secondaryCtaLink || '',
        stat1Label: data.stat1Label || '',
        stat1Value: data.stat1Value || '',
        stat2Label: data.stat2Label || '',
        stat2Value: data.stat2Value || '',
        stat3Label: data.stat3Label || '',
        stat3Value: data.stat3Value || '',
        backgroundGradient: data.backgroundGradient || '',
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/products/hero
exports.updateHero = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      primaryCtaText,
      primaryCtaLink,
      secondaryCtaText,
      secondaryCtaLink,
      stat1Label,
      stat1Value,
      stat2Label,
      stat2Value,
      stat3Label,
      stat3Value,
      backgroundGradient,
      isActive,
    } = req.body;

    // Kiểm tra xem đã có hero chưa (bất kể is_active status)
    const existing = await getSectionAnyStatus('hero');

    // Get existing data to preserve fields that are not provided
    const existingData = existing?.data || {};

    const data = {
      title: (title !== undefined && title !== null && title.trim() !== '') ? title : (existingData.title || ''),
      subtitle: (subtitle !== undefined && subtitle !== null && subtitle.trim() !== '') ? subtitle : (existingData.subtitle || ''),
      description: (description !== undefined && description !== null && description.trim() !== '') ? description : (existingData.description || ''),
      primaryCtaText: (primaryCtaText !== undefined && primaryCtaText !== null && primaryCtaText.trim() !== '') ? primaryCtaText : (existingData.primaryCtaText || ''),
      primaryCtaLink: (primaryCtaLink !== undefined && primaryCtaLink !== null && primaryCtaLink.trim() !== '') ? primaryCtaLink : (existingData.primaryCtaLink || ''),
      secondaryCtaText: (secondaryCtaText !== undefined && secondaryCtaText !== null && secondaryCtaText.trim() !== '') ? secondaryCtaText : (existingData.secondaryCtaText || ''),
      secondaryCtaLink: (secondaryCtaLink !== undefined && secondaryCtaLink !== null && secondaryCtaLink.trim() !== '') ? secondaryCtaLink : (existingData.secondaryCtaLink || ''),
      stat1Label: (stat1Label !== undefined && stat1Label !== null && stat1Label.trim() !== '') ? stat1Label : (existingData.stat1Label || ''),
      stat1Value: (stat1Value !== undefined && stat1Value !== null && stat1Value.trim() !== '') ? stat1Value : (existingData.stat1Value || ''),
      stat2Label: (stat2Label !== undefined && stat2Label !== null && stat2Label.trim() !== '') ? stat2Label : (existingData.stat2Label || ''),
      stat2Value: (stat2Value !== undefined && stat2Value !== null && stat2Value.trim() !== '') ? stat2Value : (existingData.stat2Value || ''),
      stat3Label: (stat3Label !== undefined && stat3Label !== null && stat3Label.trim() !== '') ? stat3Label : (existingData.stat3Label || ''),
      stat3Value: (stat3Value !== undefined && stat3Value !== null && stat3Value.trim() !== '') ? stat3Value : (existingData.stat3Value || ''),
      backgroundGradient: (backgroundGradient !== undefined && backgroundGradient !== null && backgroundGradient.trim() !== '') ? backgroundGradient : (existingData.backgroundGradient || ''),
    };

    let result;

    if (existing) {
      // Update existing
      const { rows } = await pool.query(
        `UPDATE products_sections
         SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [JSON.stringify(data), isActive !== undefined ? isActive : (existing.is_active !== undefined ? existing.is_active : true), existing.id],
      );
      result = rows[0];
    } else {
      // Create new
      const { rows } = await pool.query(
        `INSERT INTO products_sections (section_type, data, is_active)
         VALUES ('hero', $1, $2)
         RETURNING *`,
        [JSON.stringify(data), isActive !== undefined ? isActive : true],
      );
      result = rows[0];
    }

    const resultData = result.data || {};

    return res.json({
      success: true,
      data: {
        id: result.id,
        title: resultData.title || '',
        subtitle: resultData.subtitle || '',
        description: resultData.description || '',
        primaryCtaText: resultData.primaryCtaText || '',
        primaryCtaLink: resultData.primaryCtaLink || '',
        secondaryCtaText: resultData.secondaryCtaText || '',
        secondaryCtaLink: resultData.secondaryCtaLink || '',
        stat1Label: resultData.stat1Label || '',
        stat1Value: resultData.stat1Value || '',
        stat2Label: resultData.stat2Label || '',
        stat2Value: resultData.stat2Value || '',
        stat3Label: resultData.stat3Label || '',
        stat3Value: resultData.stat3Value || '',
        backgroundGradient: resultData.backgroundGradient || '',
        isActive: result.is_active !== undefined ? result.is_active : true,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};
