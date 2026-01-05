const { pool } = require('../config/database');

/**
 * Lấy tất cả các trang SEO (admin)
 */
async function getSeoPages(req, res) {
  try {
    const result = await pool.query(
      `SELECT * FROM seo_pages ORDER BY page_path ASC`
    );

    return res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Error fetching SEO pages:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách trang SEO',
      error: error.message,
    });
  }
}

/**
 * Lấy SEO theo page path (admin)
 */
async function getSeoPageByPath(req, res) {
  try {
    let { path } = req.params;
    
    // Nếu path không có, dùng '/'
    if (!path || path === '') {
      path = '/';
    }
    
    // Decode path
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(path);
    } catch (e) {
      decodedPath = path;
    }

    const result = await pool.query(
      `SELECT * FROM seo_pages WHERE page_path = $1`,
      [decodedPath]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cấu hình SEO cho trang này',
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching SEO page:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cấu hình SEO',
      error: error.message,
    });
  }
}

/**
 * Cập nhật hoặc tạo mới SEO page (admin)
 */
async function updateSeoPage(req, res) {
  try {
    let { path } = req.params;
    
    // Nếu path không có, dùng '/'
    if (!path || path === '') {
      path = '/';
    }
    
    // Decode path
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(path);
    } catch (e) {
      decodedPath = path;
    }
    
    const {
      page_type,
      title,
      description,
      keywords,
      og_title,
      og_description,
      og_image,
      og_type,
      twitter_card,
      twitter_title,
      twitter_description,
      twitter_image,
      canonical_url,
      robots_index,
      robots_follow,
      robots_noarchive,
      robots_nosnippet,
      structured_data,
    } = req.body;

    // Kiểm tra xem đã tồn tại chưa
    const checkResult = await pool.query(
      `SELECT id FROM seo_pages WHERE page_path = $1`,
      [decodedPath]
    );

    if (checkResult.rows.length > 0) {
      // Update
      const updateResult = await pool.query(
        `UPDATE seo_pages SET
          page_type = COALESCE($1, page_type),
          title = COALESCE($2, title),
          description = COALESCE($3, description),
          keywords = COALESCE($4, keywords),
          og_title = COALESCE($5, og_title),
          og_description = COALESCE($6, og_description),
          og_image = COALESCE($7, og_image),
          og_type = COALESCE($8, og_type),
          twitter_card = COALESCE($9, twitter_card),
          twitter_title = COALESCE($10, twitter_title),
          twitter_description = COALESCE($11, twitter_description),
          twitter_image = COALESCE($12, twitter_image),
          canonical_url = COALESCE($13, canonical_url),
          robots_index = COALESCE($14, robots_index),
          robots_follow = COALESCE($15, robots_follow),
          robots_noarchive = COALESCE($16, robots_noarchive),
          robots_nosnippet = COALESCE($17, robots_nosnippet),
          structured_data = COALESCE($18, structured_data),
          updated_at = CURRENT_TIMESTAMP
        WHERE page_path = $19
        RETURNING *`,
        [
          page_type,
          title,
          description,
          keywords,
          og_title,
          og_description,
          og_image,
          og_type,
          twitter_card,
          twitter_title,
          twitter_description,
          twitter_image,
          canonical_url,
          robots_index,
          robots_follow,
          robots_noarchive,
          robots_nosnippet,
          structured_data ? JSON.stringify(structured_data) : null,
          decodedPath,
        ]
      );

      return res.status(200).json({
        success: true,
        message: 'Cập nhật cấu hình SEO thành công',
        data: updateResult.rows[0],
      });
    } else {
      // Insert
      const insertResult = await pool.query(
        `INSERT INTO seo_pages (
          page_path, page_type, title, description, keywords,
          og_title, og_description, og_image, og_type,
          twitter_card, twitter_title, twitter_description, twitter_image,
          canonical_url, robots_index, robots_follow, robots_noarchive, robots_nosnippet,
          structured_data
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
        RETURNING *`,
        [
          decodedPath,
          page_type || null,
          title || null,
          description || null,
          keywords || null,
          og_title || null,
          og_description || null,
          og_image || null,
          og_type || 'website',
          twitter_card || 'summary_large_image',
          twitter_title || null,
          twitter_description || null,
          twitter_image || null,
          canonical_url || null,
          robots_index !== undefined ? robots_index : true,
          robots_follow !== undefined ? robots_follow : true,
          robots_noarchive !== undefined ? robots_noarchive : false,
          robots_nosnippet !== undefined ? robots_nosnippet : false,
          structured_data ? JSON.stringify(structured_data) : null,
        ]
      );

      return res.status(201).json({
        success: true,
        message: 'Tạo cấu hình SEO thành công',
        data: insertResult.rows[0],
      });
    }
  } catch (error) {
    console.error('Error updating SEO page:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật cấu hình SEO',
      error: error.message,
    });
  }
}

/**
 * Lấy SEO theo page path (public - không cần auth)
 */
async function getPublicSeoByPath(req, res) {
  try {
    let { path } = req.params;
    
    // Nếu path không có, dùng '/'
    if (!path || path === '') {
      path = '/';
    }
    
    // Decode path
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(path);
    } catch (e) {
      decodedPath = path;
    }

    const result = await pool.query(
      `SELECT * FROM seo_pages WHERE page_path = $1`,
      [decodedPath]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy cấu hình SEO',
      });
    }

    const seoData = result.rows[0];
    
    // Parse structured_data nếu có
    if (seoData.structured_data) {
      try {
        seoData.structured_data = typeof seoData.structured_data === 'string' 
          ? JSON.parse(seoData.structured_data)
          : seoData.structured_data;
      } catch (e) {
        console.error('Error parsing structured_data:', e);
      }
    }

    return res.status(200).json({
      success: true,
      data: seoData,
    });
  } catch (error) {
    console.error('Error fetching public SEO:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy cấu hình SEO',
      error: error.message,
    });
  }
}

module.exports = {
  getSeoPages,
  getSeoPageByPath,
  updateSeoPage,
  getPublicSeoByPath,
};


