const { pool } = require('../config/database');

// Helper function để tạo slug từ name
const slugify = (text) => {
  if (!text) return '';
  const textStr = typeof text === 'string' ? text : (text.vi || text.en || text.ja || '');
  return textStr
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

// Helper function để xử lý locale object: convert thành JSON string nếu là object, giữ nguyên nếu là string
// Đối với VARCHAR(255), nếu JSON string quá dài thì truncate hoặc chỉ lưu giá trị vi
const processLocaleField = (value, maxLength = null) => {
  if (value === undefined || value === null) return '';
  
  // Helper để truncate string đảm bảo không vượt quá maxLength
  const truncateString = (str, maxLen) => {
    if (!maxLen) return str;
    if (str.length <= maxLen) return str;
    return str.substring(0, maxLen);
  };
  
  if (typeof value === 'string') {
    // Nếu là JSON string (bắt đầu bằng {), parse và stringify lại để đảm bảo format đúng
    if (value.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && (parsed.vi !== undefined || parsed.en !== undefined || parsed.ja !== undefined)) {
          const jsonStr = JSON.stringify(parsed);
          // Nếu có maxLength và vượt quá, chỉ lưu giá trị vi (và truncate nếu cần)
          if (maxLength && jsonStr.length > maxLength) {
            const singleValue = parsed.vi || parsed.en || parsed.ja || '';
            return truncateString(singleValue, maxLength);
          }
          // Đảm bảo JSON string không vượt quá maxLength
          return truncateString(jsonStr, maxLength);
        }
      } catch (e) {
        // Không phải JSON hợp lệ, truncate string gốc
        return truncateString(value, maxLength);
      }
    }
    // Truncate string thông thường nếu cần
    return truncateString(value, maxLength);
  }
  
  if (typeof value === 'object' && !Array.isArray(value)) {
    // Kiểm tra xem có phải locale object không
    if (value.vi !== undefined || value.en !== undefined || value.ja !== undefined) {
      const jsonStr = JSON.stringify(value);
      // Nếu có maxLength và vượt quá, chỉ lưu giá trị vi (và truncate nếu cần)
      if (maxLength && jsonStr.length > maxLength) {
        const singleValue = value.vi || value.en || value.ja || '';
        return truncateString(singleValue, maxLength);
      }
      // Đảm bảo JSON string không vượt quá maxLength
      return truncateString(jsonStr, maxLength);
    }
  }
  
  const strValue = String(value);
  return truncateString(strValue, maxLength);
};

// Helper function để parse locale field từ database: nếu là JSON string thì parse, nếu không thì trả về string
const parseLocaleField = (value) => {
  if (!value) return '';
  if (typeof value === 'string') {
    // Thử parse JSON
    if (value.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && (parsed.vi !== undefined || parsed.en !== undefined || parsed.ja !== undefined)) {
          return parsed;
        }
      } catch (e) {
        // Không phải JSON hợp lệ, trả về string gốc
      }
    }
    return value;
  }
  return value;
};

// Chuẩn hóa dữ liệu product trả về cho frontend
const mapProduct = (row) => ({
  id: row.id,
  categoryId: row.category_id,
  category: row.category_name || row.category_slug || '',
  slug: row.slug,
  name: parseLocaleField(row.name),
  tagline: parseLocaleField(row.tagline),
  meta: parseLocaleField(row.meta),
  description: parseLocaleField(row.description),
  image: row.image || '',
  gradient: row.gradient || '',
  pricing: parseLocaleField(row.pricing),
  badge: parseLocaleField(row.badge),
  statsUsers: parseLocaleField(row.stats_users),
  statsRating: row.stats_rating || 0,
  statsDeploy: parseLocaleField(row.stats_deploy),
  demoLink: row.demo_link || '',
  sortOrder: row.sort_order || 0,
  isFeatured: row.is_featured || false,
  isActive: row.is_active !== undefined ? row.is_active : true,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  features: Array.isArray(row.features) ? row.features.map(f => parseLocaleField(f)) : [],
  seoTitle: parseLocaleField(row.seo_title),
  seoDescription: parseLocaleField(row.seo_description),
  seoKeywords: parseLocaleField(row.seo_keywords),
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
        features: Array.isArray(p.features) ? p.features.map(f => parseLocaleField(f)) : [],
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
      features: Array.isArray(rows[0].features) ? rows[0].features.map(f => parseLocaleField(f)) : [],
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

    // Kiểm tra name không rỗng (hỗ trợ cả string và locale object)
    const nameStr = typeof name === 'string' ? name : (name?.vi || name?.en || name?.ja || '');
    if (!nameStr.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tên sản phẩm không được để trống',
      });
    }

    // Xử lý slug: ưu tiên slug từ request, nếu không có thì auto-generate từ name
    const finalSlug = (slug && typeof slug === 'string' && slug.trim()) ? slug.trim() : slugify(name);

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
        ? features.map(f => {
            // Nếu là locale object, giữ nguyên để lưu vào JSONB
            if (typeof f === 'object' && !Array.isArray(f) && (f.vi !== undefined || f.en !== undefined || f.ja !== undefined)) {
              return f;
            }
            // Nếu là string, trim và filter
            return typeof f === 'string' ? f.trim() : String(f).trim();
          }).filter(f => {
            // Filter: nếu là locale object thì check có ít nhất 1 giá trị không rỗng
            if (typeof f === 'object' && !Array.isArray(f) && (f.vi !== undefined || f.en !== undefined || f.ja !== undefined)) {
              return (f.vi && f.vi.trim()) || (f.en && f.en.trim()) || (f.ja && f.ja.trim());
            }
            return f;
          })
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
            categoryId || null, finalSlug, processLocaleField(name, 255), processLocaleField(tagline, 500), processLocaleField(meta, 255), processLocaleField(description), image, gradient,
            processLocaleField(pricing, 255), processLocaleField(badge, 255), processLocaleField(statsUsers, 255), statsRating, processLocaleField(statsDeploy, 255), demoLink || null, JSON.stringify(featureTexts),
            processLocaleField(seoTitle, 255), processLocaleField(seoDescription), processLocaleField(seoKeywords),
            sortOrder, isFeatured, isActive,
          ]
        : [
            categoryId || null, finalSlug, processLocaleField(name, 255), processLocaleField(tagline, 500), processLocaleField(meta, 255), processLocaleField(description), image, gradient,
            processLocaleField(pricing, 255), processLocaleField(badge, 255), processLocaleField(statsUsers, 255), statsRating, processLocaleField(statsDeploy, 255), demoLink || null,
            processLocaleField(seoTitle, 255), processLocaleField(seoDescription), processLocaleField(seoKeywords),
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
        features: Array.isArray(productRows[0].features) ? productRows[0].features.map(f => parseLocaleField(f)) : [],
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
          // Đảm bảo value là string và không null
          const finalValue = value === null ? null : String(value);
          params.push(finalValue);
          fields.push(`${column} = $${params.length}`);
        }
      };

      // Xử lý slug: ưu tiên slug từ request, nếu không có thì auto-generate từ name
      if (slug !== undefined) {
        // Nếu có slug từ request, sử dụng slug đó
        const finalSlug = (typeof slug === 'string' ? slug.trim() : '') || slugify(name || existing[0].name);
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
      } else if (name !== undefined) {
        // Kiểm tra name có thay đổi không (so sánh cả locale object)
        const existingName = existing[0].name;
        const nameChanged = JSON.stringify(parseLocaleField(existingName)) !== JSON.stringify(name);
        if (nameChanged) {
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
      }

      addField('category_id', categoryId);
      addField('name', processLocaleField(name, 255)); // VARCHAR(255)
      addField('tagline', processLocaleField(tagline, 500)); // VARCHAR(500)
      addField('meta', processLocaleField(meta, 255)); // VARCHAR(255)
      addField('description', processLocaleField(description)); // TEXT - không giới hạn
      // image, gradient, demo_link là TEXT hoặc VARCHAR lớn, nhưng vẫn truncate để an toàn
      addField('image', image ? (typeof image === 'string' ? image.substring(0, 1000) : String(image).substring(0, 1000)) : null);
      addField('gradient', gradient ? processLocaleField(gradient, 255) : null); // VARCHAR(255)
      addField('pricing', processLocaleField(pricing, 255)); // VARCHAR(255)
      addField('badge', processLocaleField(badge, 255)); // VARCHAR(255)
      addField('stats_users', processLocaleField(statsUsers, 255)); // VARCHAR(255)
      addField('stats_rating', statsRating);
      addField('stats_deploy', processLocaleField(statsDeploy, 255)); // VARCHAR(255)
      addField('demo_link', demoLink ? (typeof demoLink === 'string' ? demoLink.substring(0, 500) : String(demoLink).substring(0, 500)) : null); // VARCHAR(500)
      addField('seo_title', processLocaleField(seoTitle, 255)); // VARCHAR(255)
      addField('seo_description', processLocaleField(seoDescription)); // TEXT - không giới hạn
      addField('seo_keywords', processLocaleField(seoKeywords)); // TEXT - không giới hạn
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
            ? features.map(f => {
                // Nếu là locale object, giữ nguyên để lưu vào JSONB
                if (typeof f === 'object' && !Array.isArray(f) && (f.vi !== undefined || f.en !== undefined || f.ja !== undefined)) {
                  return f;
                }
                // Nếu là string, trim và filter
                return typeof f === 'string' ? f.trim() : String(f).trim();
              }).filter(f => {
                // Filter: nếu là locale object thì check có ít nhất 1 giá trị không rỗng
                if (typeof f === 'object' && !Array.isArray(f) && (f.vi !== undefined || f.en !== undefined || f.ja !== undefined)) {
                  return (f.vi && f.vi.trim()) || (f.en && f.en.trim()) || (f.ja && f.ja.trim());
                }
                return f;
              })
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
        features: Array.isArray(productRows[0].features) ? productRows[0].features.map(f => parseLocaleField(f)) : [],
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

