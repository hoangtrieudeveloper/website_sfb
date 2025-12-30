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
  sortOrder: row.sort_order || 0,
  isFeatured: row.is_featured || false,
  isActive: row.is_active !== undefined ? row.is_active : true,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  features: row.features || [],
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

    // Lấy products với features
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

    // Lấy features cho từng product
    const productIds = products.map(p => p.id);
    let featuresMap = {};
    
    if (productIds.length > 0) {
      const featuresQuery = `
        SELECT product_id, feature_text, sort_order
        FROM product_features
        WHERE product_id = ANY($1)
        ORDER BY product_id, sort_order ASC
      `;
      const { rows: features } = await pool.query(featuresQuery, [productIds]);
      
      features.forEach(f => {
        if (!featuresMap[f.product_id]) {
          featuresMap[f.product_id] = [];
        }
        featuresMap[f.product_id].push(f.feature_text);
      });
    }

    // Gộp features vào products
    const productsWithFeatures = products.map(p => ({
      ...mapProduct(p),
      features: featuresMap[p.id] || [],
    }));

    return res.json({
      success: true,
      data: productsWithFeatures,
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/admin/products/:id
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

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

    // Lấy features
    const { rows: features } = await pool.query(
      'SELECT feature_text FROM product_features WHERE product_id = $1 ORDER BY sort_order ASC',
      [id],
    );

    const product = {
      ...mapProduct(rows[0]),
      features: features.map(f => f.feature_text),
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
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm không được để trống',
      });
    }

    const slug = slugify(name);

    // Kiểm tra slug trùng
    const { rows: existing } = await pool.query(
      'SELECT id FROM products WHERE slug = $1',
      [slug],
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Slug đã tồn tại, vui lòng đổi tên sản phẩm',
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Insert product
      const insertQuery = `
        INSERT INTO products (
          category_id, slug, name, tagline, meta, description, image, gradient,
          pricing, badge, stats_users, stats_rating, stats_deploy,
          sort_order, is_featured, is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        RETURNING *
      `;

      const { rows } = await client.query(insertQuery, [
        categoryId || null,
        slug,
        name,
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
        sortOrder,
        isFeatured,
        isActive,
      ]);

      const productId = rows[0].id;

      // Insert features
      if (features && features.length > 0) {
        const featureValues = features.map((feature, index) => 
          `(${productId}, $${index + 1}, ${index})`
        ).join(', ');
        
        const featureTexts = features.map(f => f.trim()).filter(f => f);
        
        if (featureTexts.length > 0) {
          const featureQuery = `
            INSERT INTO product_features (product_id, feature_text, sort_order)
            VALUES ${featureTexts.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')}
          `;
          
          const featureParams = [];
          featureTexts.forEach((text, index) => {
            featureParams.push(productId, text, index);
          });
          
          await client.query(featureQuery, featureParams);
        }
      }

      await client.query('COMMIT');

      // Lấy lại product với features
      const { rows: productRows } = await pool.query(
        `
          SELECT
            p.*,
            pc.name AS category_name,
            pc.slug AS category_slug
          FROM products p
          LEFT JOIN product_categories pc ON p.category_id = pc.id
          WHERE p.id = $1
        `,
        [productId],
      );

      const { rows: featureRows } = await pool.query(
        'SELECT feature_text FROM product_features WHERE product_id = $1 ORDER BY sort_order ASC',
        [productId],
      );

      const product = {
        ...mapProduct(productRows[0]),
        features: featureRows.map(f => f.feature_text),
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
      sortOrder,
      isFeatured,
      isActive,
      features,
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

      // Nếu name thay đổi, cập nhật slug
      if (name !== undefined && name !== existing[0].name) {
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
      addField('sort_order', sortOrder);
      addField('is_featured', isFeatured);
      addField('is_active', isActive);

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

      // Cập nhật features nếu có
      if (features !== undefined) {
        // Xóa features cũ
        await client.query('DELETE FROM product_features WHERE product_id = $1', [id]);

        // Thêm features mới
        if (features && features.length > 0) {
          const featureTexts = features.map(f => typeof f === 'string' ? f : f.trim()).filter(f => f);
          if (featureTexts.length > 0) {
            const featureQuery = `
              INSERT INTO product_features (product_id, feature_text, sort_order)
              VALUES ${featureTexts.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')}
            `;
            const featureParams = [];
            featureTexts.forEach((text, index) => {
              featureParams.push(id, text, index);
            });
            await client.query(featureQuery, featureParams);
          }
        }
      }

      await client.query('COMMIT');

      // Lấy lại product với features
      const { rows: productRows } = await pool.query(
        `
          SELECT
            p.*,
            pc.name AS category_name,
            pc.slug AS category_slug
          FROM products p
          LEFT JOIN product_categories pc ON p.category_id = pc.id
          WHERE p.id = $1
        `,
        [id],
      );

      const { rows: featureRows } = await pool.query(
        'SELECT feature_text FROM product_features WHERE product_id = $1 ORDER BY sort_order ASC',
        [id],
      );

      const product = {
        ...mapProduct(productRows[0]),
        features: featureRows.map(f => f.feature_text),
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

