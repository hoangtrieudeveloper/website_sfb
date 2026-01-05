const { pool } = require('../config/database');

// Helper function để tạo slug từ name
const slugify = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Chuẩn hóa dữ liệu product trả về cho frontend
const mapProduct = (row) => ({
  id: row.id,
  categoryId: row.category_id,
  category: row.category_name || row.category_slug || '',
  slug: row.slug,
  name: row.name,
  tagline: row.tagline || '',
  meta: row.meta || '',
  description: row.description || '',
  image: row.image || '',
  gradient: row.gradient || '',
  pricing: row.pricing || '',
  badge: row.badge || null,
  statsUsers: row.stats_users || '',
  statsRating: row.stats_rating || 0,
  statsDeploy: row.stats_deploy || '',
  demoLink: row.demo_link || '',
  sortOrder: row.sort_order || 0,
  isFeatured: row.is_featured || false,
  isActive: row.is_active !== undefined ? row.is_active : true,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  features: Array.isArray(row.features) ? row.features : [],
  seoTitle: row.seo_title || '',
  seoDescription: row.seo_description || '',
  seoKeywords: row.seo_keywords || '',
});

// GET /api/admin/products
exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, featured, active } = req.query;

    const conditions = [];
    const params = [];

    if (category) {
      params.push(category);
      conditions.push(`p.category_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      conditions.push(`(LOWER(p.name) LIKE $${params.length} OR LOWER(p.tagline) LIKE $${params.length})`);
    }

    if (featured === 'true') {
      conditions.push('p.is_featured = true');
    }

    if (active !== undefined) {
      params.push(active === 'true');
      conditions.push(`p.is_active = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Lấy products với features (từ JSONB)
    // Kiểm tra xem cột features có tồn tại không
    const { rows: columnCheck } = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'features'
    `);
    const hasFeaturesColumn = columnCheck.length > 0;
    
    const featuresSelect = hasFeaturesColumn ? 'p.features,' : 'NULL::jsonb as features,';
    
    const query = `
      SELECT
        p.id,
        p.category_id,
        pc.name AS category_name,
        pc.slug AS category_slug,
        p.slug,
        p.name,
        p.tagline,
        p.meta,
        p.description,
        p.image,
        p.gradient,
        p.pricing,
        p.badge,
        p.stats_users,
        p.stats_rating,
        p.stats_deploy,
        p.demo_link,
        ${featuresSelect}
        p.seo_title,
        p.seo_description,
        p.seo_keywords,
        p.sort_order,
        p.is_featured,
        p.is_active,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      ${whereClause}
      ORDER BY p.sort_order ASC, p.id DESC
    `;

    const { rows: products } = await pool.query(query, params);

    return res.json({
      success: true,
      data: products.map(p => ({
        ...mapProduct(p),
        features: Array.isArray(p.features) ? p.features : [],
      })),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem cột features có tồn tại không
    const { rows: columnCheck } = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'products' AND column_name = 'features'
    `);
    const hasFeaturesColumn = columnCheck.length > 0;
    const featuresSelect = hasFeaturesColumn ? 'p.features,' : 'NULL::jsonb as features,';

    const { rows } = await pool.query(
      `
        SELECT
          p.id,
          p.category_id,
          pc.name AS category_name,
          pc.slug AS category_slug,
          p.slug,
          p.name,
          p.tagline,
          p.meta,
          p.description,
          p.image,
          p.gradient,
          p.pricing,
          p.badge,
          p.stats_users,
          p.stats_rating,
          p.stats_deploy,
          ${featuresSelect}
          p.seo_title,
          p.seo_description,
          p.seo_keywords,
          p.sort_order,
          p.is_featured,
          p.is_active,
          p.created_at,
          p.updated_at
        FROM products p
        LEFT JOIN product_categories pc ON p.category_id = pc.id
        WHERE p.id = $1
        LIMIT 1
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    const product = {
      ...mapProduct(rows[0]),
      features: Array.isArray(rows[0].features) ? rows[0].features : [],
    };

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/admin/products
exports.createProduct = async (req, res, next) => {
  try {
    const {
      categoryId,
      name,
      slug,
      tagline = '',
      meta = '',
      description = '',
      image = '',
      gradient = '',
      pricing = '',
      badge = null,
      statsUsers = '',
      statsRating = 0,
      statsDeploy = '',
      sortOrder = 0,
      isFeatured = false,
      isActive = true,
      features = [],
      seoTitle = '',
      seoDescription = '',
      seoKeywords = '',
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm không được để trống',
      });
    }

    // Xử lý slug: ưu tiên slug từ request, nếu không có thì auto-generate từ name
    const finalSlug = (slug && slug.trim()) ? slug.trim() : slugify(name);

    // Kiểm tra slug trùng
    const { rows: existing } = await pool.query(
      'SELECT id FROM products WHERE slug = $1',
      [finalSlug],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Slug đã tồn tại, vui lòng chọn slug khác',
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert product với features JSONB
      const featureTexts = features && Array.isArray(features) 
        ? features.map(f => f.trim()).filter(f => f) 
        : [];

      // Kiểm tra xem cột features có tồn tại không
      const { rows: columnCheck } = await client.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'features'
      `);
      const hasFeaturesColumn = columnCheck.length > 0;

      const insertFields = hasFeaturesColumn
        ? 'category_id, slug, name, tagline, meta, description, image, gradient, pricing, badge, stats_users, stats_rating, stats_deploy, demo_link, features, seo_title, seo_description, seo_keywords, sort_order, is_featured, is_active'
        : 'category_id, slug, name, tagline, meta, description, image, gradient, pricing, badge, stats_users, stats_rating, stats_deploy, demo_link, seo_title, seo_description, seo_keywords, sort_order, is_featured, is_active';
      
      const insertValues = hasFeaturesColumn
        ? '$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21'
        : '$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20';

      const { demoLink } = req.body;
      const insertParams = hasFeaturesColumn
        ? [
            categoryId || null, finalSlug, name, tagline, meta, description, image, gradient,
            pricing, badge, statsUsers, statsRating, statsDeploy, demoLink || null, JSON.stringify(featureTexts),
            seoTitle || null, seoDescription || null, seoKeywords || null,
            sortOrder, isFeatured, isActive,
          ]
        : [
            categoryId || null, finalSlug, name, tagline, meta, description, image, gradient,
            pricing, badge, statsUsers, statsRating, statsDeploy, demoLink || null,
            seoTitle || null, seoDescription || null, seoKeywords || null,
            sortOrder, isFeatured, isActive,
          ];

      const insertQuery = `
        INSERT INTO products (${insertFields})
        VALUES (${insertValues})
        RETURNING *
      `;

      const { rows } = await client.query(insertQuery, insertParams);

      const productId = rows[0].id;

      await client.query('COMMIT');

      // Lấy lại product với features
      const { rows: columnCheck2 } = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'features'
      `);
      const hasFeaturesColumn2 = columnCheck2.length > 0;
      const featuresSelect2 = hasFeaturesColumn2 ? 'p.features,' : 'NULL::jsonb as features,';

      const { rows: productRows } = await pool.query(
        `
          SELECT
            p.id,
            p.category_id,
            p.slug,
            p.name,
            p.tagline,
            p.meta,
            p.description,
            p.image,
            p.gradient,
            p.pricing,
            p.badge,
            p.stats_users,
            p.stats_rating,
            p.stats_deploy,
            ${featuresSelect2}
            p.seo_title,
            p.seo_description,
            p.seo_keywords,
            p.sort_order,
            p.is_featured,
            p.is_active,
            p.created_at,
            p.updated_at,
            pc.name AS category_name,
            pc.slug AS category_slug
          FROM products p
          LEFT JOIN product_categories pc ON p.category_id = pc.id
          WHERE p.id = $1
        `,
        [productId],
      );

      const product = {
        ...mapProduct(productRows[0]),
        features: Array.isArray(productRows[0].features) ? productRows[0].features : [],
      };

      return res.status(201).json({
        success: true,
        data: product,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      categoryId,
      name,
      slug,
      tagline,
      meta,
      description,
      image,
      gradient,
      pricing,
      badge,
      statsUsers,
      statsRating,
      statsDeploy,
      demoLink,
      sortOrder,
      isFeatured,
      isActive,
      features,
      seoTitle,
      seoDescription,
      seoKeywords,
    } = req.body;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Kiểm tra product tồn tại
      const { rows: existing } = await client.query(
        'SELECT id, slug FROM products WHERE id = $1',
        [id],
      );

      if (existing.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sản phẩm',
        });
      }

      const fields = [];
      const params = [];

      const addField = (column, value) => {
        if (value !== undefined) {
          params.push(value);
          fields.push(`${column} = $${params.length}`);
        }
      };

      // Xử lý slug: ưu tiên slug từ request, nếu không có thì auto-generate từ name
      if (slug !== undefined) {
        // Nếu có slug từ request, sử dụng slug đó
        const finalSlug = slug.trim() || slugify(name || existing[0].name);
        // Kiểm tra slug trùng (trừ chính nó)
        const { rows: slugCheck } = await client.query(
          'SELECT id FROM products WHERE slug = $1 AND id != $2',
          [finalSlug, id],
        );
        if (slugCheck.length > 0) {
          await client.query('ROLLBACK');
          return res.status(400).json({
            success: false,
            message: 'Slug đã tồn tại, vui lòng chọn slug khác',
          });
        }
        addField('slug', finalSlug);
      } else if (name !== undefined && name !== existing[0].name) {
        // Nếu không có slug từ request nhưng name thay đổi, auto-generate slug từ name
        const newSlug = slugify(name);
        // Kiểm tra slug trùng (trừ chính nó)
        const { rows: slugCheck } = await client.query(
          'SELECT id FROM products WHERE slug = $1 AND id != $2',
          [newSlug, id],
        );
        if (slugCheck.length > 0) {
          await client.query('ROLLBACK');
          return res.status(400).json({
            success: false,
            message: 'Slug đã tồn tại, vui lòng đổi tên sản phẩm',
          });
        }
        addField('slug', newSlug);
      }

      addField('category_id', categoryId);
      addField('name', name);
      addField('tagline', tagline);
      addField('meta', meta);
      addField('description', description);
      addField('image', image);
      addField('gradient', gradient);
      addField('pricing', pricing);
      addField('badge', badge);
      addField('stats_users', statsUsers);
      addField('stats_rating', statsRating);
      addField('stats_deploy', statsDeploy);
      addField('demo_link', demoLink);
      addField('seo_title', seoTitle);
      addField('seo_description', seoDescription);
      addField('seo_keywords', seoKeywords);
      addField('sort_order', sortOrder);
      addField('is_featured', isFeatured);
      addField('is_active', isActive);

      // Cập nhật features nếu có (JSONB)
      if (features !== undefined) {
        // Kiểm tra xem cột features có tồn tại không
        const { rows: columnCheck } = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'products' AND column_name = 'features'
        `);
        const hasFeaturesColumn = columnCheck.length > 0;
        
        if (hasFeaturesColumn) {
          const featureTexts = features && Array.isArray(features)
            ? features.map(f => typeof f === 'string' ? f.trim() : String(f).trim()).filter(f => f)
            : [];
          addField('features', JSON.stringify(featureTexts));
        }
      }

      if (fields.length > 0) {
        params.push(id);
        const updateQuery = `
          UPDATE products
          SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
          WHERE id = $${params.length}
          RETURNING *
        `;
        await client.query(updateQuery, params);
      }

      await client.query('COMMIT');

      // Lấy lại product với features
      const { rows: columnCheck3 } = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'features'
      `);
      const hasFeaturesColumn3 = columnCheck3.length > 0;
      const featuresSelect3 = hasFeaturesColumn3 ? 'p.features,' : 'NULL::jsonb as features,';

      const { rows: productRows } = await pool.query(
        `
          SELECT
            p.id,
            p.category_id,
            p.slug,
            p.name,
            p.tagline,
            p.meta,
            p.description,
            p.image,
            p.gradient,
            p.pricing,
            p.badge,
            p.stats_users,
            p.stats_rating,
            p.stats_deploy,
            ${featuresSelect3}
            p.seo_title,
            p.seo_description,
            p.seo_keywords,
            p.sort_order,
            p.is_featured,
            p.is_active,
            p.created_at,
            p.updated_at,
            pc.name AS category_name,
            pc.slug AS category_slug
          FROM products p
          LEFT JOIN product_categories pc ON p.category_id = pc.id
          WHERE p.id = $1
        `,
        [id],
      );

      const product = {
        ...mapProduct(productRows[0]),
        features: Array.isArray(productRows[0].features) ? productRows[0].features : [],
      };

      return res.json({
        success: true,
        data: product,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    return next(error);
  }
};

// DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa sản phẩm',
    });
  } catch (error) {
    return next(error);
  }
};

// PATCH /api/admin/products/:id/toggle
exports.toggleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { field } = req.body; // 'active' hoặc 'featured'

    if (!field || !['active', 'featured'].includes(field)) {
      return res.status(400).json({
        success: false,
        message: 'Field phải là "active" hoặc "featured"',
      });
    }

    const column = field === 'active' ? 'is_active' : 'is_featured';

    const { rows } = await pool.query(
      `
        UPDATE products
        SET ${column} = NOT ${column}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, ${column}
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    return res.json({
      success: true,
      data: {
        id: rows[0].id,
        [field === 'active' ? 'isActive' : 'isFeatured']: rows[0][column],
      },
    });
  } catch (error) {
    return next(error);
  }
};

