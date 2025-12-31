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

// GET /api/admin/industries/process
exports.getProcess = async (req, res, next) => {
  try {
    const section = await getSection('process-header');
    const steps = await pool.query(
      'SELECT * FROM industries_section_items WHERE section_type = $1 AND is_active = true ORDER BY sort_order ASC',
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
      const headerData = {
        subtitle: header.subtitle || '',
        titlePart1: header.titlePart1 || '',
        titleHighlight: header.titleHighlight || '',
        titlePart2: header.titlePart2 || '',
      };

      const section = await getSection('process-header');

      if (section) {
        processHeaderId = section.id;
        await client.query(
          'UPDATE industries_sections SET data = $1, is_active = $2 WHERE id = $3',
          [JSON.stringify(headerData), header.isActive !== undefined ? header.isActive : true, processHeaderId]
        );
      } else {
        const { rows: inserted } = await client.query(
          'INSERT INTO industries_sections (section_type, data, is_active) VALUES ($1, $2, $3) RETURNING id',
          ['process-header', JSON.stringify(headerData), header.isActive !== undefined ? header.isActive : true]
        );
        processHeaderId = inserted[0].id;
      }
    } else {
      // Get existing header id if exists
      const section = await getSection('process-header');
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

    // Fetch updated data
    const updatedSection = await getSection('process-header');
    const updatedSteps = await getItems(processHeaderId || updatedSection?.id, 'process');

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
