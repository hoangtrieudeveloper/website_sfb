const { pool } = require('../config/database');

const mapNews = (row) => {
  // Format published_date để tránh timezone issues
  let publishedDate = row.published_date;
  if (publishedDate instanceof Date) {
    const year = publishedDate.getFullYear();
    const month = String(publishedDate.getMonth() + 1).padStart(2, '0');
    const day = String(publishedDate.getDate()).padStart(2, '0');
    publishedDate = `${year}-${month}-${day}`;
  } else if (publishedDate && typeof publishedDate === 'string' && publishedDate.includes('T')) {
    publishedDate = publishedDate.split('T')[0];
  }
  
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    categoryId: row.category_id,
    categoryName: row.category_name,
    status: row.status,
    imageUrl: row.image_url,
    author: row.author,
    readTime: row.read_time,
    gradient: row.gradient,
    isFeatured: row.is_featured,
    seoTitle: row.seo_title,
    seoDescription: row.seo_description,
    seoKeywords: row.seo_keywords,
    galleryTitle: row.gallery_title || '',
    publishedDate: publishedDate || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    // Các cấu hình hiển thị chi tiết bài viết
    galleryImages: (() => {
      if (!row.gallery_images) return [];
      if (Array.isArray(row.gallery_images)) return row.gallery_images;
      try {
        const parsed = JSON.parse(row.gallery_images);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    })(),
    galleryPosition:
      row.gallery_position === 'top'
        ? 'top'
        : row.gallery_position === 'bottom'
          ? 'bottom'
          : null,
    showTableOfContents:
      row.show_table_of_contents !== false,
    enableShareButtons:
      row.enable_share_buttons !== false,
    showAuthorBox:
      row.show_author_box !== false,
    highlightFirstParagraph: !!row.highlight_first_paragraph,
  };
};

// GET /api/public/news - Chỉ lấy bài viết đã published
exports.getPublicNews = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;

    const conditions = ['n.status = $1'];
    const params = ['published'];

    if (category) {
      params.push(category);
      conditions.push(`n.category_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      conditions.push(`(LOWER(n.title) LIKE $${params.length} OR LOWER(n.excerpt) LIKE $${params.length})`);
    }

    if (featured === 'true') {
      conditions.push('n.is_featured = true');
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const query = `
      SELECT
        n.id,
        n.title,
        n.slug,
        n.excerpt,
        n.content,
        n.category,
        n.category_id,
        c.name AS category_name,
        n.status,
        n.image_url,
        n.author,
        n.read_time,
        n.gradient,
        n.is_featured,
        n.seo_title,
        n.seo_description,
        n.seo_keywords,
        n.gallery_title,
        n.gallery_images,
        n.gallery_position,
        n.show_table_of_contents,
        n.enable_share_buttons,
        n.show_author_box,
        n.highlight_first_paragraph,
        TO_CHAR(n.published_date, 'YYYY-MM-DD') AS published_date,
        n.created_at,
        n.updated_at
      FROM news n
      LEFT JOIN news_categories c ON n.category_id = c.code
      ${whereClause}
      ORDER BY n.is_featured DESC, n.published_date DESC, n.id DESC
    `;

    const { rows } = await pool.query(query, params);

    return res.json({
      success: true,
      data: rows.map(mapNews),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/news/featured
exports.getFeaturedNews = async (req, res, next) => {
  try {
    const query = `
      SELECT
        n.id,
        n.title,
        n.slug,
        n.excerpt,
        n.content,
        n.category,
        n.category_id,
        c.name AS category_name,
        n.status,
        n.image_url,
        n.author,
        n.read_time,
        n.gradient,
        n.is_featured,
        n.seo_title,
        n.seo_description,
        n.seo_keywords,
        n.gallery_title,
        n.gallery_images,
        n.gallery_position,
        n.show_table_of_contents,
        n.enable_share_buttons,
        n.show_author_box,
        n.highlight_first_paragraph,
        TO_CHAR(n.published_date, 'YYYY-MM-DD') AS published_date,
        n.created_at,
        n.updated_at
      FROM news n
      LEFT JOIN news_categories c ON n.category_id = c.code
      WHERE n.status = $1 AND n.is_featured = true
      ORDER BY n.published_date DESC, n.id DESC
      LIMIT 5
    `;

    const { rows } = await pool.query(query, ['published']);

    return res.json({
      success: true,
      data: rows.map(mapNews),
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/news/:slug
exports.getPublicNewsBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const query = `
      SELECT
        n.id,
        n.title,
        n.slug,
        n.excerpt,
        n.content,
        n.category,
        n.category_id,
        c.name AS category_name,
        n.status,
        n.image_url,
        n.author,
        n.read_time,
        n.gradient,
        n.is_featured,
        n.seo_title,
        n.seo_description,
        n.seo_keywords,
        n.gallery_title,
        n.gallery_images,
        n.gallery_position,
        n.show_table_of_contents,
        n.enable_share_buttons,
        n.show_author_box,
        n.highlight_first_paragraph,
        TO_CHAR(n.published_date, 'YYYY-MM-DD') AS published_date,
        n.created_at,
        n.updated_at
      FROM news n
      LEFT JOIN news_categories c ON n.category_id = c.code
      WHERE n.slug = $1 AND n.status = $2
    `;

    const { rows } = await pool.query(query, [slug, 'published']);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết',
      });
    }

    return res.json({
      success: true,
      data: mapNews(rows[0]),
    });
  } catch (error) {
    return next(error);
  }
};

