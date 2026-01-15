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
const processLocaleField = (value) => {
  if (value === undefined || value === null) return '';
  if (typeof value === 'string') {
    // Nếu là JSON string (bắt đầu bằng {), parse và stringify lại để đảm bảo format đúng
    if (value.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && (parsed.vi !== undefined || parsed.en !== undefined || parsed.ja !== undefined)) {
          return JSON.stringify(parsed);
        }
      } catch (e) {
        // Không phải JSON hợp lệ, trả về string gốc
      }
    }
    return value;
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    // Kiểm tra xem có phải locale object không
    if (value.vi !== undefined || value.en !== undefined || value.ja !== undefined) {
      return JSON.stringify(value);
    }
  }
  return String(value);
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

// GET /api/admin/products/:productId/detail
exports.getProductDetail = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Lấy product detail
    const { rows: details } = await pool.query(
      'SELECT * FROM product_details WHERE product_id = $1',
      [productId],
    );

    if (details.length === 0) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const detail = details[0];

    // Lấy overview cards từ products_section_items
    const { rows: overviewCardsRows } = await pool.query(
      'SELECT * FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
      [detail.id, 'overview-cards'],
    );

    // Lấy showcase bullets từ products_section_items
    const { rows: showcaseBulletsRows } = await pool.query(
      'SELECT * FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
      [detail.id, 'showcase-bullets'],
    );

    // Lấy numbered sections từ products_section_items
    const { rows: numberedSectionsRows } = await pool.query(
      'SELECT * FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
      [detail.id, 'numbered-sections'],
    );

    // Lấy paragraphs cho từng section từ products_section_items
    const sectionIds = numberedSectionsRows.map(s => s.id);
    let paragraphsMap = {};
    
    if (sectionIds.length > 0) {
      // Lấy tất cả paragraphs của product detail này
      const { rows: paragraphsRows } = await pool.query(
        'SELECT * FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
        [detail.id, 'section-paragraphs'],
      );
      
      paragraphsRows.forEach(p => {
        // Parse parent_id từ data JSONB
        const data = p.data || {};
        const parentId = parseInt(data.parent_id || data.numbered_section_id || '0');
        if (parentId && sectionIds.includes(parentId)) {
          if (!paragraphsMap[parentId]) {
            paragraphsMap[parentId] = [];
          }
          // Khôi phục cả title và text (đều có thể là string hoặc JSON locale)
          const titleRaw = data.paragraph_title || '';
          const textRaw = data.paragraph_text || data.text || '';
          paragraphsMap[parentId].push({
            title: parseLocaleField(titleRaw),
            text: parseLocaleField(textRaw),
          });
        }
      });
    }

    // Lấy expand bullets từ products_section_items
    const { rows: expandBulletsRows } = await pool.query(
      'SELECT * FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 ORDER BY sort_order ASC',
      [detail.id, 'expand-bullets'],
    );

    // Parse overview cards
    const overviewCards = overviewCardsRows.map(row => ({
      id: row.id,
      step: row.data?.step || 0,
      title: row.data?.title || '',
      description: row.data?.description || '',
      sortOrder: row.sort_order || 0,
    }));

    // Parse showcase bullets
    const showcaseBullets = showcaseBulletsRows.map(row => ({
      id: row.id,
      bullet_text: row.data?.bullet_text || row.data?.text || '',
      sortOrder: row.sort_order || 0,
    }));

    // Parse numbered sections
    const sectionsWithParagraphs = numberedSectionsRows.map(section => ({
      id: section.id,
      sectionNo: section.data?.section_no || section.data?.sectionNo || 0,
      title: parseLocaleField(section.data?.title || ''),
      // Hỗ trợ cả imageBack/imageFront (mới) và image (cũ) để backward compatible
      imageBack: section.data?.overlay_back_image || section.data?.imageBack || section.data?.image || '',
      imageFront: section.data?.overlay_front_image || section.data?.imageFront || '',
      image: section.data?.image || '', // Giữ lại để backward compatible
      imageAlt: parseLocaleField(section.data?.image_alt || section.data?.imageAlt || ''),
      imageSide: section.data?.image_side || section.data?.imageSide || 'left',
      overlayBackImage: section.data?.overlay_back_image || section.data?.imageBack || '',
      overlayFrontImage: section.data?.overlay_front_image || section.data?.imageFront || '',
      // paragraphs đã được parseLocaleField ở trên (có thể là string hoặc locale object)
      paragraphs: paragraphsMap[section.id] || [],
      sortOrder: section.sort_order || 0,
    }));

    return res.json({
      success: true,
      data: {
        id: detail.id,
        productId: detail.product_id,
        slug: detail.slug,
        contentMode: detail.content_mode || 'config',
        contentHtml: parseLocaleField(detail.content_html),
        metaTop: parseLocaleField(detail.meta_top),
        heroDescription: parseLocaleField(detail.hero_description),
        heroImage: detail.hero_image || '',
        ctaContactText: parseLocaleField(detail.cta_contact_text),
        ctaContactHref: detail.cta_contact_href || '',
        ctaDemoText: parseLocaleField(detail.cta_demo_text),
        ctaDemoHref: detail.cta_demo_href || '',
        overviewKicker: parseLocaleField(detail.overview_kicker),
        overviewTitle: parseLocaleField(detail.overview_title),
        overviewCards: overviewCards.map(card => ({
          ...card,
          title: parseLocaleField(card.title),
          description: parseLocaleField(card.description),
        })),
        showcase: {
          title: parseLocaleField(detail.showcase_title),
          desc: parseLocaleField(detail.showcase_desc),
          bullets: showcaseBullets.map(b => parseLocaleField(b.bullet_text)),
          ctaText: parseLocaleField(detail.showcase_cta_text),
          ctaHref: detail.showcase_cta_href || '',
          imageBack: detail.showcase_image_back || '',
          imageFront: detail.showcase_image_front || '',
        },
        numberedSections: sectionsWithParagraphs.map(section => ({
          ...section,
          title: parseLocaleField(section.title),
          paragraphs: section.paragraphs.map(p => parseLocaleField(p)),
        })),
        expand: {
          title: parseLocaleField(detail.expand_title),
          bullets: expandBulletsRows.map(b => parseLocaleField(b.data?.bullet_text || b.data?.text || '')),
          ctaText: parseLocaleField(detail.expand_cta_text),
          ctaHref: detail.expand_cta_href || '',
          image: detail.expand_image || '',
        },
        galleryTitle: parseLocaleField(detail.gallery_title),
        galleryImages: Array.isArray(detail.gallery_images) ? detail.gallery_images : (detail.gallery_images ? JSON.parse(detail.gallery_images) : []),
        galleryPosition: detail.gallery_position || 'top',
        showTableOfContents: detail.show_table_of_contents !== false,
        enableShareButtons: detail.enable_share_buttons !== false,
        showAuthorBox: detail.show_author_box !== false,
        createdAt: detail.created_at,
        updatedAt: detail.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// POST /api/admin/products/:productId/detail
// PUT /api/admin/products/:productId/detail
exports.saveProductDetail = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const {
      slug,
      contentMode,
      contentHtml,
      metaTop,
      heroDescription,
      heroImage,
      ctaContactText,
      ctaContactHref,
      ctaDemoText,
      ctaDemoHref,
      overviewKicker,
      overviewTitle,
      overviewCards = [],
      showcase = {},
      numberedSections = [],
      expand = {},
      galleryTitle,
      galleryImages = [],
      galleryPosition = 'top',
      showTableOfContents = true,
      enableShareButtons = true,
      showAuthorBox = true,
    } = req.body;

    // Kiểm tra product tồn tại
    const { rows: product } = await pool.query(
      'SELECT id, name FROM products WHERE id = $1',
      [productId],
    );

    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy sản phẩm',
      });
    }

    const finalSlug = slug || slugify(product[0].name);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Kiểm tra xem đã có detail chưa
      const { rows: existing } = await client.query(
        'SELECT id FROM product_details WHERE product_id = $1',
        [productId],
      );

      let detailId;

      if (existing.length > 0) {
        // Update
        detailId = existing[0].id;
        await client.query(
          `
            UPDATE product_details
            SET
              slug = $1,
              content_mode = $2,
              content_html = $3,
              meta_top = $4,
              hero_description = $5,
              hero_image = $6,
              cta_contact_text = $7,
              cta_contact_href = $8,
              cta_demo_text = $9,
              cta_demo_href = $10,
              overview_kicker = $11,
              overview_title = $12,
              showcase_title = $13,
              showcase_desc = $14,
              showcase_cta_text = $15,
              showcase_cta_href = $16,
              showcase_image_back = $17,
              showcase_image_front = $18,
              expand_title = $19,
              expand_cta_text = $20,
              expand_cta_href = $21,
              expand_image = $22,
              gallery_title = $23,
              gallery_images = $24,
              gallery_position = $25,
              show_table_of_contents = $26,
              enable_share_buttons = $27,
              show_author_box = $28,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $29
          `,
          [
            finalSlug,
            contentMode || 'config',
            processLocaleField(contentHtml),
            processLocaleField(metaTop),
            processLocaleField(heroDescription),
            heroImage || '',
            processLocaleField(ctaContactText),
            ctaContactHref || '',
            processLocaleField(ctaDemoText),
            ctaDemoHref || '',
            processLocaleField(overviewKicker),
            processLocaleField(overviewTitle),
            processLocaleField(showcase?.title),
            processLocaleField(showcase?.desc),
            processLocaleField(showcase?.ctaText),
            showcase?.ctaHref || '',
            showcase?.imageBack || '',
            showcase?.imageFront || '',
            processLocaleField(expand?.title),
            processLocaleField(expand?.ctaText),
            expand?.ctaHref || '',
            expand?.image || '',
            processLocaleField(galleryTitle),
            JSON.stringify(galleryImages),
            galleryPosition || 'top',
            showTableOfContents !== false,
            enableShareButtons !== false,
            showAuthorBox !== false,
            detailId,
          ],
        );
      } else {
        // Create
        const { rows: newDetail } = await client.query(
          `
            INSERT INTO product_details (
              product_id, slug, content_mode, content_html,
              meta_top, hero_description, hero_image,
              cta_contact_text, cta_contact_href, cta_demo_text, cta_demo_href,
              overview_kicker, overview_title,
              showcase_title, showcase_desc, showcase_cta_text, showcase_cta_href,
              showcase_image_back, showcase_image_front,
              expand_title, expand_cta_text, expand_cta_href, expand_image,
              gallery_title, gallery_images, gallery_position,
              show_table_of_contents, enable_share_buttons, show_author_box
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)
            RETURNING id
          `,
          [
            productId,
            finalSlug,
            contentMode || 'config',
            processLocaleField(contentHtml),
            processLocaleField(metaTop),
            processLocaleField(heroDescription),
            heroImage || '',
            processLocaleField(ctaContactText),
            ctaContactHref || '',
            processLocaleField(ctaDemoText),
            ctaDemoHref || '',
            processLocaleField(overviewKicker),
            processLocaleField(overviewTitle),
            processLocaleField(showcase?.title),
            processLocaleField(showcase?.desc),
            processLocaleField(showcase?.ctaText),
            showcase?.ctaHref || '',
            showcase?.imageBack || '',
            showcase?.imageFront || '',
            processLocaleField(expand?.title),
            processLocaleField(expand?.ctaText),
            expand?.ctaHref || '',
            expand?.image || '',
            processLocaleField(galleryTitle),
            JSON.stringify(galleryImages),
            galleryPosition || 'top',
            showTableOfContents !== false,
            enableShareButtons !== false,
            showAuthorBox !== false,
          ],
        );
        detailId = newDetail[0].id;
      }

      // Xóa và tạo lại overview cards
      await client.query('DELETE FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2', [detailId, 'overview-cards']);
      if (overviewCards && overviewCards.length > 0) {
        for (let i = 0; i < overviewCards.length; i++) {
          const card = overviewCards[i];
          await client.query(
            `INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              detailId,
              'overview-cards',
              JSON.stringify({
                step: card.step || i + 1,
                title: processLocaleField(card.title),
                description: processLocaleField(card.description),
              }),
              i,
              true,
            ],
          );
        }
      }

      // Xóa và tạo lại showcase bullets
      await client.query('DELETE FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2', [detailId, 'showcase-bullets']);
      if (showcase.bullets && showcase.bullets.length > 0) {
        for (let i = 0; i < showcase.bullets.length; i++) {
          await client.query(
            `INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              detailId,
              'showcase-bullets',
              JSON.stringify({
                bullet_text: processLocaleField(showcase.bullets[i]),
              }),
              i,
              true,
            ],
          );
        }
      }

      // Xóa và tạo lại numbered sections
      await client.query('DELETE FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2', [detailId, 'numbered-sections']);
      if (numberedSections && numberedSections.length > 0) {
        for (let i = 0; i < numberedSections.length; i++) {
          const section = numberedSections[i];
          // Map imageBack và imageFront vào overlay_back_image và overlay_front_image
          const imageBackValue = section.imageBack || section.overlayBackImage || '';
          const imageFrontValue = section.imageFront || section.overlayFrontImage || '';
          // Nếu có imageBack thì dùng làm image chính, nếu không thì dùng image cũ
          const imageValue = section.imageBack || section.image || '';
          
          const { rows: newSection } = await client.query(
            `INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [
              detailId,
              'numbered-sections',
              JSON.stringify({
                section_no: section.sectionNo,
                title: processLocaleField(section.title),
                image: imageValue,
                image_alt: section.imageAlt || '',
                image_side: section.imageSide || 'left',
                overlay_back_image: imageBackValue,
                overlay_front_image: imageFrontValue,
              }),
              i,
              true,
            ],
          );

          const sectionId = newSection[0].id;

          // Thêm paragraphs cho section này
          if (section.paragraphs && section.paragraphs.length > 0) {
            // Xóa paragraphs cũ của section này
            await client.query(
              'DELETE FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 AND (data->>\'parent_id\')::int = $3',
              [detailId, 'section-paragraphs', sectionId],
            );

            for (let j = 0; j < section.paragraphs.length; j++) {
              const para = section.paragraphs[j] || {};
              const paragraphTitle = para.title !== undefined ? para.title : '';
              const paragraphText = para.text !== undefined ? para.text : para;

              await client.query(
                `INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                  detailId,
                  'section-paragraphs',
                  JSON.stringify({
                    parent_id: sectionId,
                    numbered_section_id: sectionId,
                    paragraph_title: processLocaleField(paragraphTitle),
                    paragraph_text: processLocaleField(paragraphText),
                    text: processLocaleField(paragraphText),
                  }),
                  j,
                  true,
                ],
              );
            }
          }
        }
      }

      // Xóa và tạo lại expand bullets
      await client.query('DELETE FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2', [detailId, 'expand-bullets']);
      if (expand.bullets && expand.bullets.length > 0) {
        for (let i = 0; i < expand.bullets.length; i++) {
          await client.query(
            `INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
             VALUES ($1, $2, $3, $4, $5)`,
            [
              detailId,
              'expand-bullets',
              JSON.stringify({
                bullet_text: processLocaleField(expand.bullets[i]),
              }),
              i,
              true,
            ],
          );
        }
      }

      await client.query('COMMIT');

      // Lấy lại data đầy đủ
      const { rows: detailRows } = await client.query(
        'SELECT * FROM product_details WHERE id = $1',
        [detailId],
      );

      return res.json({
        success: true,
        data: {
          id: detailRows[0].id,
          productId: detailRows[0].product_id,
          slug: detailRows[0].slug,
          message: 'Đã lưu chi tiết sản phẩm thành công',
        },
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

