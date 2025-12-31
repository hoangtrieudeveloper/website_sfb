const { pool } = require('../config/database');

// GET /api/admin/industries/hero
exports.getHero = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM industries_hero WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const hero = rows[0];

    // Lấy stats
    const { rows: stats } = await pool.query(
      'SELECT * FROM industries_hero_stats WHERE hero_id = $1 ORDER BY sort_order ASC',
      [hero.id],
    );

    return res.json({
      success: true,
      data: {
        id: hero.id,
        titlePrefix: hero.title_prefix || '',
        titleSuffix: hero.title_suffix || '',
        description: hero.description || '',
        buttonText: hero.button_text || '',
        buttonLink: hero.button_link || '',
        image: hero.image || '',
        backgroundGradient: hero.background_gradient || '',
        stats: stats.map(s => ({
          id: s.id,
          iconName: s.icon_name || '',
          value: s.value,
          label: s.label,
          gradient: s.gradient || '',
          sortOrder: s.sort_order || 0,
        })),
        isActive: hero.is_active !== undefined ? hero.is_active : true,
        createdAt: hero.created_at,
        updatedAt: hero.updated_at,
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

    // Kiểm tra xem đã có hero chưa
    const { rows: existing } = await client.query(
      'SELECT id FROM industries_hero WHERE is_active = true ORDER BY id DESC LIMIT 1',
    );

    let heroId;

    if (existing.length > 0) {
      // Update existing
      heroId = existing[0].id;
      await client.query(
        `
          UPDATE industries_hero
          SET
            title_prefix = $1,
            title_suffix = $2,
            description = $3,
            button_text = $4,
            button_link = $5,
            image = $6,
            background_gradient = $7,
            is_active = $8,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $9
        `,
        [
          titlePrefix || '',
          titleSuffix || '',
          description || '',
          buttonText || '',
          buttonLink || '',
          image || '',
          backgroundGradient || '',
          isActive !== undefined ? isActive : true,
          heroId,
        ],
      );
    } else {
      // Create new
      const { rows: newHero } = await client.query(
        `
          INSERT INTO industries_hero (
            title_prefix, title_suffix, description,
            button_text, button_link, image,
            background_gradient, is_active
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          RETURNING id
        `,
        [
          titlePrefix || '',
          titleSuffix || '',
          description || '',
          buttonText || '',
          buttonLink || '',
          image || '',
          backgroundGradient || '',
          isActive !== undefined ? isActive : true,
        ],
      );
      heroId = newHero[0].id;
    }

    // Xóa và tạo lại stats
    await client.query('DELETE FROM industries_hero_stats WHERE hero_id = $1', [heroId]);
    if (stats && stats.length > 0) {
      for (let i = 0; i < stats.length; i++) {
        const stat = stats[i];
        await client.query(
          `
            INSERT INTO industries_hero_stats (hero_id, icon_name, value, label, gradient, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6)
          `,
          [
            heroId,
            stat.iconName || '',
            stat.value || '',
            stat.label || '',
            stat.gradient || '',
            stat.sortOrder || i,
          ],
        );
      }
    }

    await client.query('COMMIT');

    // Fetch updated data
    const { rows: updatedHero } = await client.query(
      'SELECT * FROM industries_hero WHERE id = $1',
      [heroId],
    );
    const { rows: updatedStats } = await client.query(
      'SELECT * FROM industries_hero_stats WHERE hero_id = $1 ORDER BY sort_order ASC',
      [heroId],
    );

    return res.json({
      success: true,
      message: 'Đã cập nhật hero thành công',
      data: {
        id: updatedHero[0].id,
        titlePrefix: updatedHero[0].title_prefix || '',
        titleSuffix: updatedHero[0].title_suffix || '',
        description: updatedHero[0].description || '',
        buttonText: updatedHero[0].button_text || '',
        buttonLink: updatedHero[0].button_link || '',
        image: updatedHero[0].image || '',
        backgroundGradient: updatedHero[0].background_gradient || '',
        stats: updatedStats.map(s => ({
          id: s.id,
          iconName: s.icon_name || '',
          value: s.value,
          label: s.label,
          gradient: s.gradient || '',
          sortOrder: s.sort_order || 0,
        })),
        isActive: updatedHero[0].is_active !== undefined ? updatedHero[0].is_active : true,
        createdAt: updatedHero[0].created_at,
        updatedAt: updatedHero[0].updated_at,
      },
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return next(error);
  } finally {
    client.release();
  }
};

