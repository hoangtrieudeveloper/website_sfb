const { pool } = require('../config/database');

// Helper function to check if value is empty (supports both string and locale object)
const isEmpty = (value) => {
  if (!value) return true;
  if (typeof value === 'string') {
    return value.trim() === '';
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    // Check if it's a locale object (has vi, en, ja keys)
    if ('vi' in value || 'en' in value || 'ja' in value) {
      // Locale object - check if all values are empty
      const vi = (value.vi || '').trim();
      const en = (value.en || '').trim();
      const ja = (value.ja || '').trim();
      return vi === '' && en === '' && ja === '';
    }
  }
  return false;
};

// Helper function to get value (supports both string and locale object)
const getValue = (value, defaultValue = '') => {
  if (!value) return defaultValue;
  if (typeof value === 'string') {
    return value.trim() || defaultValue;
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    // If it's a locale object, return it as is
    if ('vi' in value || 'en' in value || 'ja' in value) {
      return value;
    }
  }
  return defaultValue;
};

// Helper function to get section by type (only active)
const getSection = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM industries_sections WHERE section_type = $1 AND is_active = true',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Helper function to get section by type (any status)
const getSectionAnyStatus = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM industries_sections WHERE section_type = $1',
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

// GET /api/admin/industries/process
exports.getProcess = async (req, res, next) => {
  try {
    // For admin, get section with any status
    const section = await getSectionAnyStatus('process-header');
    // For admin, get all steps (any status) to manage them
    const steps = await pool.query(
      'SELECT * FROM industries_section_items WHERE section_type = $1 ORDER BY sort_order ASC',
      ['process']
    );

    return res.json({
      success: true,
      data: {
        header: section ? {
          id: section.id,
          subtitle: section.data?.subtitle || '',
          titlePart1: section.data?.titlePart1 || '',
          titleHighlight: section.data?.titleHighlight || '',
          titlePart2: section.data?.titlePart2 || '',
          isActive: section.is_active !== undefined ? section.is_active : true,
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
            isActive: s.is_active !== undefined ? s.is_active : true,
          };
        }),
      },
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/industries/process
exports.updateProcess = async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const { header, steps = [] } = req.body;

    // Update/Create header
    let processHeaderId;
    if (header) {
      // Check if section exists (any status)
      const section = await getSectionAnyStatus('process-header');

      if (section) {
        // Update existing - ALWAYS preserve existing data if new data is empty or undefined
        processHeaderId = section.id;
        const existingData = section.data || {};
        const headerData = {
          // Only update if new value is provided and not empty, otherwise keep existing
          subtitle: !isEmpty(header.subtitle) ? getValue(header.subtitle) : (existingData.subtitle || ''),
          titlePart1: !isEmpty(header.titlePart1) ? getValue(header.titlePart1) : (existingData.titlePart1 || ''),
          titleHighlight: !isEmpty(header.titleHighlight) ? getValue(header.titleHighlight) : (existingData.titleHighlight || ''),
          titlePart2: !isEmpty(header.titlePart2) ? getValue(header.titlePart2) : (existingData.titlePart2 || ''),
        };
        await client.query(
          'UPDATE industries_sections SET data = $1, is_active = $2 WHERE id = $3',
          [JSON.stringify(headerData), header.isActive !== undefined ? header.isActive : true, processHeaderId]
        );
      } else {
        // Insert new
        const headerData = {
          subtitle: getValue(header.subtitle),
          titlePart1: getValue(header.titlePart1),
          titleHighlight: getValue(header.titleHighlight),
          titlePart2: getValue(header.titlePart2),
        };
        const { rows: inserted } = await client.query(
          'INSERT INTO industries_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
          ['process-header', JSON.stringify(headerData), header.isActive !== undefined ? header.isActive : true]
        );
        processHeaderId = inserted[0].id;
      }
    } else {
      // Get existing header id if exists (any status)
      const section = await getSectionAnyStatus('process-header');
      if (section) {
        processHeaderId = section.id;
      }
    }

    // Delete all old steps
    if (processHeaderId) {
      await client.query('DELETE FROM industries_section_items WHERE section_id = $1 AND section_type = $2', [processHeaderId, 'process']);
    } else {
      await client.query('DELETE FROM industries_section_items WHERE section_type = $1', ['process']);
    }

    // Insert new steps
    if (steps && steps.length > 0) {
      // If no header, create a temporary one
      if (!processHeaderId) {
        const { rows: inserted } = await client.query(
          'INSERT INTO industries_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
          ['process-header', JSON.stringify({}), true]
        );
        processHeaderId = inserted[0].id;
      }

      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const itemData = {
          stepId: step.stepId || '',
          iconName: step.iconName || '',
          title: step.title || '',
          description: step.description || '',
          points: step.points || [],
          image: step.image || '',
          colors: step.colors || {},
          button: step.button || {},
        };
        await client.query(
          'INSERT INTO industries_section_items (section_id, section_type, data, sort_order, is_active) VALUES ($1, $2, $3, $4, $5)',
          [processHeaderId, 'process', JSON.stringify(itemData), step.sortOrder || i, step.isActive !== undefined ? step.isActive : true]
        );
      }
    }

    await client.query('COMMIT');

    // Fetch updated data (any status)
    const updatedSection = await getSectionAnyStatus('process-header');
    const sectionId = processHeaderId || updatedSection?.id;
    const updatedSteps = sectionId ? await getItems(sectionId, 'process') : [];

    return res.json({
      success: true,
      message: 'Đã cập nhật process thành công',
      data: {
        header: updatedSection ? {
          id: updatedSection.id,
          subtitle: updatedSection.data?.subtitle || '',
          titlePart1: updatedSection.data?.titlePart1 || '',
          titleHighlight: updatedSection.data?.titleHighlight || '',
          titlePart2: updatedSection.data?.titlePart2 || '',
          isActive: updatedSection.is_active !== undefined ? updatedSection.is_active : true,
        } : null,
        steps: updatedSteps.map(s => {
          const itemData = s.data || {};
          return {
            id: s.id,
            stepId: itemData.stepId || '',
            iconName: itemData.iconName || '',
            title: itemData.title || '',
            description: itemData.description || '',
            points: itemData.points || [],
            image: itemData.image || '',
            colors: itemData.colors || {},
            button: itemData.button || {},
            sortOrder: s.sort_order || 0,
            isActive: s.is_active !== undefined ? s.is_active : true,
          };
        }),
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
};
