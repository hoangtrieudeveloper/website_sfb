const { pool } = require('../config/database');

// Chuẩn hóa dữ liệu trả về cho frontend
const mapNews = (row) => {
  // Format published_date để tránh timezone issues
  // Nếu là Date object, format thành YYYY-MM-DD
  // Nếu đã là string YYYY-MM-DD, giữ nguyên
  let publishedDate = row.published_date;
  if (publishedDate instanceof Date) {
    // Nếu là Date object, format thành YYYY-MM-DD
    const year = publishedDate.getFullYear();
    const month = String(publishedDate.getMonth() + 1).padStart(2, '0');
    const day = String(publishedDate.getDate()).padStart(2, '0');
    publishedDate = `${year}-${month}-${day}`;
  } else if (publishedDate && typeof publishedDate === 'string' && publishedDate.includes('T')) {
    // Nếu là ISO string, chỉ lấy phần date
    publishedDate = publishedDate.split('T')[0];
  }
  
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt || '',
    category: row.category || row.category_name || '',
    categoryId: row.category_id || row.category_code || '',
    categoryName: row.category_name || row.category || '',
    status: row.status,
    imageUrl: row.image_url || '',
    author: row.author || '',
    readTime: row.read_time || '',
    gradient: row.gradient || '',
    isFeatured: row.is_featured || false,
    link: row.slug || '',
    publishedDate: publishedDate || '',
    seoTitle: row.seo_title || '',
    seoDescription: row.seo_description || '',
    seoKeywords: row.seo_keywords || '',
    content: row.content || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
};

// GET /api/admin/news
exports.getNews = async (req, res, next) => {
  try {
    const { status, category, search, featured } = req.query;

    const conditions = [];
    const params = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (category) {
      params.push(category);
      conditions.push(`category_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search.toLowerCase()}%`);
      conditions.push(`LOWER(title) LIKE $${params.length}`);
    }

    if (featured === 'true') {
      conditions.push('n.is_featured = true');
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

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
        TO_CHAR(n.published_date, 'YYYY-MM-DD') AS published_date,
        n.created_at,
        n.updated_at
      FROM news n
      LEFT JOIN news_categories c ON n.category_id = c.code
      ${whereClause}
      ORDER BY n.id DESC
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

// GET /api/admin/news/:id
exports.getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await pool.query(
      `
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
          TO_CHAR(n.published_date, 'YYYY-MM-DD') AS published_date,
          n.created_at,
          n.updated_at
        FROM news n
        LEFT JOIN news_categories c ON n.category_id = c.code
        WHERE n.id = $1
        LIMIT 1
      `,
      [id],
    );
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

// POST /api/admin/news
exports.createNews = async (req, res, next) => {
  try {
    const {
      title,
      excerpt = '',
      category = '',
      categoryId = '',
      content = '',
      status = 'draft',
      imageUrl = '',
      author = '',
      readTime = '',
      gradient = '',
      link = '',
      publishedDate = new Date().toISOString().split('T')[0],
      seoTitle = '',
      seoDescription = '',
      seoKeywords = '',
      isFeatured = false,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Tiêu đề không được để trống',
      });
    }

    const insertQuery = `
      INSERT INTO news (
        title, slug, excerpt, content, category, category_id,
        status, image_url, author, read_time, gradient, published_date,
        seo_title, seo_description, seo_keywords, is_featured
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING 
        id, title, slug, excerpt, content, category, category_id,
        status, image_url, author, read_time, gradient, 
        TO_CHAR(published_date, 'YYYY-MM-DD') AS published_date,
        seo_title, seo_description, seo_keywords, is_featured,
        created_at, updated_at
    `;

    const params = [
      title,
      link,
      excerpt,
      content,
      category,
      categoryId,
      status,
      imageUrl,
      author,
      readTime,
      gradient,
      publishedDate,
      seoTitle,
      seoDescription,
      seoKeywords,
      isFeatured,
    ];

    const { rows } = await pool.query(insertQuery, params);

    return res.status(201).json({
      success: true,
      data: mapNews(rows[0]),
    });
  } catch (error) {
    return next(error);
  }
};

// PUT /api/admin/news/:id
exports.updateNews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      category,
      categoryId,
      content,
      status,
      imageUrl,
      author,
      readTime,
      gradient,
      link,
      publishedDate,
      seoTitle,
      seoDescription,
      seoKeywords,
      isFeatured,
    } = req.body;

    const fields = [];
    const params = [];

    const addField = (column, value) => {
      params.push(value);
      fields.push(`${column} = $${params.length}`);
    };

    if (title !== undefined) addField('title', title);
    if (link !== undefined) addField('slug', link);
    if (excerpt !== undefined) addField('excerpt', excerpt);
    if (content !== undefined) addField('content', content);
    if (category !== undefined) addField('category', category);
    if (categoryId !== undefined) addField('category_id', categoryId);
    if (status !== undefined) addField('status', status);
    if (imageUrl !== undefined) addField('image_url', imageUrl);
    if (author !== undefined) addField('author', author);
    if (readTime !== undefined) addField('read_time', readTime);
    if (gradient !== undefined) addField('gradient', gradient);
    if (seoTitle !== undefined) addField('seo_title', seoTitle);
    if (seoDescription !== undefined) addField('seo_description', seoDescription);
    if (seoKeywords !== undefined) addField('seo_keywords', seoKeywords);
    if (publishedDate !== undefined) addField('published_date', publishedDate);
    if (isFeatured !== undefined) addField('is_featured', isFeatured);

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có dữ liệu để cập nhật',
      });
    }

    params.push(id);

    const updateQuery = `
      UPDATE news
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${params.length}
      RETURNING 
        id, title, slug, excerpt, content, category, category_id,
        status, image_url, author, read_time, gradient, 
        TO_CHAR(published_date, 'YYYY-MM-DD') AS published_date,
        seo_title, seo_description, seo_keywords, is_featured,
        created_at, updated_at
    `;

    const { rows } = await pool.query(updateQuery, params);

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

// DELETE /api/admin/news/:id
exports.deleteNews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query('DELETE FROM news WHERE id = $1', [
      id,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài viết',
      });
    }

    return res.json({
      success: true,
      message: 'Đã xóa bài viết',
    });
  } catch (error) {
    return next(error);
  }
};

