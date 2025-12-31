const { pool } = require('../config/database');

// Helper function to get section by type
const getSection = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM industries_sections WHERE section_type = $1 AND is_active = true',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Helper function to get items by section_id and section_type
const getItems = async (sectionId, sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM industries_section_items WHERE section_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
    [sectionId, sectionType]
  );
  return rows;
};

// GET /api/admin/industries/hero
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
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/industries/hero
exports.updateHero = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const {
      titlePrefix,
      titleSuffix,
      description,
      buttonText,
      buttonLink,
      image,
      backgroundGradient,
      stats = [],
      isActive,
    } = req.body;

    const data = {
      titlePrefix: titlePrefix || '',
      titleSuffix: titleSuffix || '',
      description: description || '',
      buttonText: buttonText || '',
      buttonLink: buttonLink || '',
      image: image || '',
      backgroundGradient: backgroundGradient || '',
    };

    const section = await getSection('hero');
    let heroId;

    if (section) {
      heroId = section.id;
      await client.query(
        'UPDATE industries_sections SET data = $1, is_active = $2 WHERE id = $3',
        [JSON.stringify(data), isActive !== undefined ? isActive : true, heroId]
      );
      await client.query('DELETE FROM industries_section_items WHERE section_id = $1 AND section_type = $2', [heroId, 'hero']);
    } else {
      const { rows: inserted } = await client.query(
        'INSERT INTO industries_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
        ['hero', JSON.stringify(data), isActive !== undefined ? isActive : true]
      );
      heroId = inserted[0].id;
    }

    // Insert stats
    if (stats && stats.length > 0) {
      for (let i = 0; i < stats.length; i++) {
        const stat = stats[i];
        const itemData = {
          iconName: stat.iconName || '',
          value: stat.value || '',
          label: stat.label || '',
          gradient: stat.gradient || '',
        };
        await client.query(
          'INSERT INTO industries_section_items (section_id, section_type, data, sort_order) VALUES ($1, $2, $3, $4)',
          [heroId, 'hero', JSON.stringify(itemData), stat.sortOrder || i]
        );
      }
    }

    await client.query('COMMIT');

    // Fetch updated data
    const updatedSection = await getSection('hero');
    const updatedStats = await getItems(heroId, 'hero');

    return res.json({
      success: true,
      message: 'Đã cập nhật hero thành công',
      data: {
        id: updatedSection.id,
        titlePrefix: updatedSection.data?.titlePrefix || '',
        titleSuffix: updatedSection.data?.titleSuffix || '',
        description: updatedSection.data?.description || '',
        buttonText: updatedSection.data?.buttonText || '',
        buttonLink: updatedSection.data?.buttonLink || '',
        image: updatedSection.data?.image || '',
        backgroundGradient: updatedSection.data?.backgroundGradient || '',
        stats: updatedStats.map(s => {
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
