const { pool } = require('../config/database');

// GET /api/admin/industries/process
exports.getProcess = async (req, res, next) => {
  try {
    // Lấy header
    const { rows: headers } = await pool.query(
      'SELECT * FROM industries_process_header WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    // Lấy steps
    const { rows: steps } = await pool.query(
      'SELECT * FROM industries_process_steps WHERE is_active = true ORDER BY sort_order ASC',
    );

    return res.json({
      success: true,
      data: {
        header: headers.length > 0 ? {
          id: headers[0].id,
          subtitle: headers[0].subtitle || '',
          titlePart1: headers[0].title_part1 || '',
          titleHighlight: headers[0].title_highlight || '',
          titlePart2: headers[0].title_part2 || '',
          isActive: headers[0].is_active !== undefined ? headers[0].is_active : true,
        } : null,
        steps: steps.map(s => ({
          id: s.id,
          stepId: s.step_id || '',
          iconName: s.icon_name || '',
          title: s.title,
          description: s.description || '',
          points: s.points || [],
          image: s.image || '',
          colors: {
            gradient: s.colors_gradient || '',
            strip: s.colors_strip || '',
            border: s.colors_border || '',
            shadowBase: s.colors_shadow_base || '',
            shadowHover: s.colors_shadow_hover || '',
            check: s.colors_check || '',
          },
          button: {
            text: s.button_text || '',
            link: s.button_link || '',
            iconName: s.button_icon_name || '',
            iconSize: s.button_icon_size || 18,
          },
          sortOrder: s.sort_order || 0,
          isActive: s.is_active !== undefined ? s.is_active : true,
        })),
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
    if (header) {
      const { rows: existing } = await client.query(
        'SELECT id FROM industries_process_header WHERE is_active = true ORDER BY id DESC LIMIT 1',
      );

      if (existing.length > 0) {
        await client.query(
          `
            UPDATE industries_process_header
            SET
              subtitle = $1,
              title_part1 = $2,
              title_highlight = $3,
              title_part2 = $4,
              is_active = $5,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $6
          `,
          [
            header.subtitle || '',
            header.titlePart1 || '',
            header.titleHighlight || '',
            header.titlePart2 || '',
            header.isActive !== undefined ? header.isActive : true,
            existing[0].id,
          ],
        );
      } else {
        await client.query(
          `
            INSERT INTO industries_process_header (subtitle, title_part1, title_highlight, title_part2, is_active)
            VALUES ($1, $2, $3, $4, $5)
          `,
          [
            header.subtitle || '',
            header.titlePart1 || '',
            header.titleHighlight || '',
            header.titlePart2 || '',
            header.isActive !== undefined ? header.isActive : true,
          ],
        );
      }
    }

    // Xóa tất cả steps cũ và tạo lại
    await client.query('DELETE FROM industries_process_steps');
    if (steps && steps.length > 0) {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        await client.query(
          `
            INSERT INTO industries_process_steps (
              step_id, icon_name, title, description, points, image,
              colors_gradient, colors_strip, colors_border,
              colors_shadow_base, colors_shadow_hover, colors_check,
              button_text, button_link, button_icon_name, button_icon_size,
              sort_order, is_active
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          `,
          [
            step.stepId || '',
            step.iconName || '',
            step.title || '',
            step.description || '',
            JSON.stringify(step.points || []),
            step.image || '',
            step.colors?.gradient || '',
            step.colors?.strip || '',
            step.colors?.border || '',
            step.colors?.shadowBase || '',
            step.colors?.shadowHover || '',
            step.colors?.check || '',
            step.button?.text || '',
            step.button?.link || '',
            step.button?.iconName || '',
            step.button?.iconSize || 18,
            step.sortOrder || i,
            step.isActive !== undefined ? step.isActive : true,
          ],
        );
      }
    }

    await client.query('COMMIT');

    // Fetch updated data
    const { rows: updatedHeaders } = await client.query(
      'SELECT * FROM industries_process_header WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );
    const { rows: updatedSteps } = await client.query(
      'SELECT * FROM industries_process_steps WHERE is_active = true ORDER BY sort_order ASC',
    );

    return res.json({
      success: true,
      message: 'Đã cập nhật process thành công',
      data: {
        header: updatedHeaders.length > 0 ? {
          id: updatedHeaders[0].id,
          subtitle: updatedHeaders[0].subtitle || '',
          titlePart1: updatedHeaders[0].title_part1 || '',
          titleHighlight: updatedHeaders[0].title_highlight || '',
          titlePart2: updatedHeaders[0].title_part2 || '',
          isActive: updatedHeaders[0].is_active !== undefined ? updatedHeaders[0].is_active : true,
        } : null,
        steps: updatedSteps.map(s => ({
          id: s.id,
          stepId: s.step_id || '',
          iconName: s.icon_name || '',
          title: s.title,
          description: s.description || '',
          points: s.points || [],
          image: s.image || '',
          colors: {
            gradient: s.colors_gradient || '',
            strip: s.colors_strip || '',
            border: s.colors_border || '',
            shadowBase: s.colors_shadow_base || '',
            shadowHover: s.colors_shadow_hover || '',
            check: s.colors_check || '',
          },
          button: {
            text: s.button_text || '',
            link: s.button_link || '',
            iconName: s.button_icon_name || '',
            iconSize: s.button_icon_size || 18,
          },
          sortOrder: s.sort_order || 0,
          isActive: s.is_active !== undefined ? s.is_active : true,
        })),
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
};

