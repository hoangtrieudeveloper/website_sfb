const { pool } = require('../config/database');

// GET /api/public/products/hero
exports.getPublicHero = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, data, is_active, created_at, updated_at 
       FROM products_sections 
       WHERE section_type = 'hero' AND is_active = true 
       ORDER BY id DESC LIMIT 1`,
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const row = rows[0];
    const data = row.data || {};
    
    return res.json({
      success: true,
      data: {
        id: row.id,
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
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/products/benefits
exports.getPublicBenefits = async (req, res, next) => {
  try {
    // Lấy benefits section
    const { rows: sections } = await pool.query(
      `SELECT id FROM products_sections 
       WHERE section_type = 'benefits' AND is_active = true 
       ORDER BY id DESC LIMIT 1`,
    );

    if (sections.length === 0) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const sectionId = sections[0].id;

    const { rows } = await pool.query(
      `SELECT id, data, sort_order, is_active, created_at, updated_at
       FROM products_section_items
       WHERE section_id = $1 AND section_type = 'benefits' AND is_active = true
       ORDER BY sort_order ASC, id ASC`,
      [sectionId],
    );

    return res.json({
      success: true,
      data: rows.map(row => {
        const data = row.data || {};
        return {
          id: row.id,
          icon: data.icon || '',
          title: data.title || '',
          description: data.description || '',
          gradient: data.gradient || '',
          sortOrder: row.sort_order || 0,
          isActive: row.is_active !== undefined ? row.is_active : true,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      }),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/products/list-header
exports.getPublicListHeader = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, data, is_active, created_at, updated_at 
       FROM products_sections 
       WHERE section_type = 'list-header' AND is_active = true 
       ORDER BY id DESC LIMIT 1`,
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const row = rows[0];
    const data = row.data || {};

    return res.json({
      success: true,
      data: {
        id: row.id,
        subtitle: data.subtitle || '',
        title: data.title || '',
        description: data.description || '',
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/products/cta
exports.getPublicCta = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, data, is_active, created_at, updated_at 
       FROM products_sections 
       WHERE section_type = 'cta' AND is_active = true 
       ORDER BY id DESC LIMIT 1`,
    );

    if (rows.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const row = rows[0];
    const data = row.data || {};
    
    return res.json({
      success: true,
      data: {
        id: row.id,
        title: data.title || '',
        description: data.description || '',
        primaryButtonText: data.primaryButtonText || data.primary?.text || '',
        primaryButtonLink: data.primaryButtonLink || data.primary?.link || '',
        secondaryButtonText: data.secondaryButtonText || data.secondary?.text || '',
        secondaryButtonLink: data.secondaryButtonLink || data.secondary?.link || '',
        backgroundColor: data.backgroundColor || '#29A3DD',
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/products/testimonials
exports.getPublicTestimonials = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM testimonials WHERE is_active = true ORDER BY sort_order ASC, id ASC'
    );
    
    const mappedData = result.rows.map(row => ({
      id: row.id,
      quote: row.quote,
      author: row.author,
      company: row.company || null,
      rating: row.rating,
      sortOrder: row.sort_order,
      isActive: row.is_active !== undefined ? row.is_active : true,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
    
    res.json({
      success: true,
      data: mappedData,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/public/products/list
exports.getPublicProducts = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;

    const conditions = [];
    const params = [];

    // Chỉ lấy products active
    conditions.push(`p.is_active = true`);

    if (category) {
      params.push(category);
      conditions.push(`p.category_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(p.name ILIKE $${params.length} OR p.tagline ILIKE $${params.length} OR p.description ILIKE $${params.length})`);
    }

    if (featured !== undefined) {
      params.push(featured === 'true');
      conditions.push(`p.is_featured = $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT 
        p.id,
        p.category_id,
        pc.name as category_name,
        pc.slug as category_slug,
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
        p.sort_order,
        p.is_featured,
        p.is_active,
        p.features,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      ${whereClause}
      ORDER BY p.sort_order ASC, p.id ASC
    `;

    const { rows } = await pool.query(query, params);

    return res.json({
      success: true,
      data: rows.map(row => ({
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
      })),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/products/categories
exports.getPublicCategories = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, slug, name, icon_name, sort_order, is_active, created_at, updated_at
       FROM product_categories
       WHERE is_active = true
       ORDER BY sort_order ASC, id ASC`
    );

    return res.json({
      success: true,
      data: rows.map(row => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        iconName: row.icon_name || '',
        sortOrder: row.sort_order || 0,
        isActive: row.is_active !== undefined ? row.is_active : true,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/products/:slug
exports.getPublicProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Lấy product basic info
    const { rows: products } = await pool.query(
      `SELECT 
        p.id,
        p.category_id,
        pc.name as category_name,
        pc.slug as category_slug,
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
        p.seo_title,
        p.seo_description,
        p.seo_keywords,
        p.sort_order,
        p.is_featured,
        p.is_active,
        p.features,
        p.created_at,
        p.updated_at
      FROM products p
      LEFT JOIN product_categories pc ON p.category_id = pc.id
      WHERE p.slug = $1 AND p.is_active = true`,
      [slug]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    const product = products[0];
    const productId = product.id;

    // Lấy product detail
    const { rows: details } = await pool.query(
      'SELECT * FROM product_details WHERE product_id = $1',
      [productId]
    );

    // Nếu không có detail, trả về product basic info
    if (details.length === 0) {
      return res.json({
        success: true,
        data: {
          id: product.id,
          categoryId: product.category_id,
          category: product.category_name || product.category_slug || '',
          slug: product.slug,
          name: product.name,
          tagline: product.tagline || '',
          meta: product.meta || '',
          description: product.description || '',
          image: product.image || '',
          gradient: product.gradient || '',
          pricing: product.pricing || '',
          badge: product.badge || null,
          statsUsers: product.stats_users || '',
          statsRating: product.stats_rating || 0,
          statsDeploy: product.stats_deploy || '',
          demoLink: product.demo_link || '',
          seoTitle: product.seo_title || '',
          seoDescription: product.seo_description || '',
          seoKeywords: product.seo_keywords || '',
          sortOrder: product.sort_order || 0,
          isFeatured: product.is_featured || false,
          isActive: product.is_active !== undefined ? product.is_active : true,
          createdAt: product.created_at,
          updatedAt: product.updated_at,
          features: Array.isArray(product.features) ? product.features : [],
          detail: null,
        },
      });
    }

    const detail = details[0];

    // Lấy overview cards
    const { rows: overviewCardsRows } = await pool.query(
      'SELECT * FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
      [detail.id, 'overview-cards']
    );

    // Lấy showcase bullets
    const { rows: showcaseBulletsRows } = await pool.query(
      'SELECT * FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
      [detail.id, 'showcase-bullets']
    );

    // Lấy numbered sections
    const { rows: numberedSectionsRows } = await pool.query(
      'SELECT * FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
      [detail.id, 'numbered-sections']
    );

    // Lấy paragraphs cho từng section
    const sectionIds = numberedSectionsRows.map(s => s.id);
    let paragraphsMap = {};
    
    if (sectionIds.length > 0) {
      const { rows: paragraphsRows } = await pool.query(
        'SELECT * FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
        [detail.id, 'section-paragraphs']
      );
      
      paragraphsRows.forEach(p => {
        const data = p.data || {};
        const parentId = parseInt(data.parent_id || data.numbered_section_id || '0');
        if (parentId && sectionIds.includes(parentId)) {
          if (!paragraphsMap[parentId]) {
            paragraphsMap[parentId] = [];
          }
          paragraphsMap[parentId].push(data.paragraph_text || data.text || '');
        }
      });
    }

    // Lấy expand bullets
    const { rows: expandBulletsRows } = await pool.query(
      'SELECT * FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
      [detail.id, 'expand-bullets']
    );

    // Parse overview cards
    const overviewCards = overviewCardsRows.map(row => ({
      step: row.data?.step || 0,
      title: row.data?.title || '',
      description: row.data?.description || row.data?.desc || '',
      desc: row.data?.description || row.data?.desc || '',
    }));

    // Parse showcase bullets
    const showcaseBullets = showcaseBulletsRows.map(row => 
      row.data?.bullet_text || row.data?.text || ''
    );

    // Parse numbered sections
    const numberedSections = numberedSectionsRows.map(section => ({
      sectionNo: section.data?.section_no || section.data?.sectionNo || section.data?.no || 0,
      no: section.data?.section_no || section.data?.sectionNo || section.data?.no || 0,
      title: section.data?.title || '',
      image: section.data?.image || section.data?.overlay_back_image || section.data?.imageBack || '',
      imageBack: section.data?.overlay_back_image || section.data?.imageBack || section.data?.image || '',
      imageFront: section.data?.overlay_front_image || section.data?.imageFront || '',
      imageSide: section.data?.image_side || section.data?.imageSide || 'left',
      paragraphs: paragraphsMap[section.id] || [],
    }));

    // Parse expand bullets
    const expandBullets = expandBulletsRows.map(b => 
      b.data?.bullet_text || b.data?.text || ''
    );

    return res.json({
      success: true,
      data: {
        // Product basic info
        id: product.id,
        categoryId: product.category_id,
        category: product.category_name || product.category_slug || '',
        slug: product.slug,
        name: product.name,
        tagline: product.tagline || '',
        meta: product.meta || '',
        description: product.description || '',
        image: product.image || '',
        gradient: product.gradient || '',
        pricing: product.pricing || '',
        badge: product.badge || null,
        statsUsers: product.stats_users || '',
        statsRating: product.stats_rating || 0,
        statsDeploy: product.stats_deploy || '',
        demoLink: product.demo_link || '',
        seoTitle: product.seo_title || '',
        seoDescription: product.seo_description || '',
        seoKeywords: product.seo_keywords || '',
        sortOrder: product.sort_order || 0,
        isFeatured: product.is_featured || false,
        isActive: product.is_active !== undefined ? product.is_active : true,
        createdAt: product.created_at,
        updatedAt: product.updated_at,
        features: Array.isArray(product.features) ? product.features : [],
        // Product detail info
        detail: {
          contentMode: detail.content_mode || 'config',
          contentHtml: detail.content_html || '',
          metaTop: detail.meta_top || '',
          heroDescription: detail.hero_description || '',
          heroImage: detail.hero_image || '',
          ctaContactText: detail.cta_contact_text || '',
          ctaContactHref: detail.cta_contact_href || '',
          ctaDemoText: detail.cta_demo_text || '',
          ctaDemoHref: detail.cta_demo_href || '',
          overviewKicker: detail.overview_kicker || '',
          overviewTitle: detail.overview_title || '',
          overviewCards: overviewCards,
          showcase: {
            title: detail.showcase_title || '',
            desc: detail.showcase_desc || '',
            bullets: showcaseBullets,
            ctaText: detail.showcase_cta_text || '',
            ctaHref: detail.showcase_cta_href || '',
            imageBack: detail.showcase_image_back || '',
            imageFront: detail.showcase_image_front || '',
            overlay: {
              back: { src: detail.showcase_image_back || '' },
              front: { src: detail.showcase_image_front || '' },
            },
          },
          numberedSections: numberedSections,
          expand: {
            title: detail.expand_title || '',
            bullets: expandBullets,
            ctaText: detail.expand_cta_text || '',
            ctaHref: detail.expand_cta_href || '',
            image: detail.expand_image || '',
          },
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

