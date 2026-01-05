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
          paragraphsMap[parentId].push(data.paragraph_text || data.text || '');
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
      title: section.data?.title || '',
      // Hỗ trợ cả imageBack/imageFront (mới) và image (cũ) để backward compatible
      imageBack: section.data?.overlay_back_image || section.data?.imageBack || section.data?.image || '',
      imageFront: section.data?.overlay_front_image || section.data?.imageFront || '',
      image: section.data?.image || '', // Giữ lại để backward compatible
      imageAlt: section.data?.image_alt || section.data?.imageAlt || '',
      imageSide: section.data?.image_side || section.data?.imageSide || 'left',
      overlayBackImage: section.data?.overlay_back_image || section.data?.imageBack || '',
      overlayFrontImage: section.data?.overlay_front_image || section.data?.imageFront || '',
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
          bullets: showcaseBullets.map(b => b.bullet_text),
          ctaText: detail.showcase_cta_text || '',
          ctaHref: detail.showcase_cta_href || '',
          imageBack: detail.showcase_image_back || '',
          imageFront: detail.showcase_image_front || '',
        },
        numberedSections: sectionsWithParagraphs,
        expand: {
          title: detail.expand_title || '',
          bullets: expandBulletsRows.map(b => b.data?.bullet_text || b.data?.text || ''),
          ctaText: detail.expand_cta_text || '',
          ctaHref: detail.expand_cta_href || '',
          image: detail.expand_image || '',
        },
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
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $23
          `,
          [
            finalSlug,
            contentMode || 'config',
            contentHtml || '',
            metaTop || '',
            heroDescription || '',
            heroImage || '',
            ctaContactText || '',
            ctaContactHref || '',
            ctaDemoText || '',
            ctaDemoHref || '',
            overviewKicker || '',
            overviewTitle || '',
            showcase.title || '',
            showcase.desc || '',
            showcase.ctaText || '',
            showcase.ctaHref || '',
            showcase.imageBack || '',
            showcase.imageFront || '',
            expand.title || '',
            expand.ctaText || '',
            expand.ctaHref || '',
            expand.image || '',
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
              expand_title, expand_cta_text, expand_cta_href, expand_image
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
            RETURNING id
          `,
          [
            productId,
            finalSlug,
            contentMode || 'config',
            contentHtml || '',
            metaTop || '',
            heroDescription || '',
            heroImage || '',
            ctaContactText || '',
            ctaContactHref || '',
            ctaDemoText || '',
            ctaDemoHref || '',
            overviewKicker || '',
            overviewTitle || '',
            showcase.title || '',
            showcase.desc || '',
            showcase.ctaText || '',
            showcase.ctaHref || '',
            showcase.imageBack || '',
            showcase.imageFront || '',
            expand.title || '',
            expand.ctaText || '',
            expand.ctaHref || '',
            expand.image || '',
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
                title: card.title || '',
                description: card.description || '',
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
                bullet_text: showcase.bullets[i] || '',
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
                title: section.title || '',
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
            await client.query('DELETE FROM products_section_items WHERE product_detail_id = $1 AND section_type = $2 AND (data->>\'parent_id\')::int = $3', [detailId, 'section-paragraphs', sectionId]);
            
            for (let j = 0; j < section.paragraphs.length; j++) {
              await client.query(
                `INSERT INTO products_section_items (product_detail_id, section_type, data, sort_order, is_active)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                  detailId,
                  'section-paragraphs',
                  JSON.stringify({
                    parent_id: sectionId,
                    numbered_section_id: sectionId,
                    paragraph_text: section.paragraphs[j] || '',
                    text: section.paragraphs[j] || '',
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
                bullet_text: expand.bullets[i] || '',
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

