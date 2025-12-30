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

    // Lấy overview cards
    const { rows: overviewCards } = await pool.query(
      'SELECT * FROM product_overview_cards WHERE product_detail_id = $1 ORDER BY sort_order ASC',
      [detail.id],
    );

    // Lấy showcase bullets
    const { rows: showcaseBullets } = await pool.query(
      'SELECT * FROM product_showcase_bullets WHERE product_detail_id = $1 ORDER BY sort_order ASC',
      [detail.id],
    );

    // Lấy numbered sections
    const { rows: numberedSections } = await pool.query(
      'SELECT * FROM product_numbered_sections WHERE product_detail_id = $1 ORDER BY sort_order ASC',
      [detail.id],
    );

    // Lấy paragraphs cho từng section
    const sectionIds = numberedSections.map(s => s.id);
    let paragraphsMap = {};
    
    if (sectionIds.length > 0) {
      const { rows: paragraphs } = await pool.query(
        'SELECT * FROM product_section_paragraphs WHERE numbered_section_id = ANY($1) ORDER BY numbered_section_id, sort_order ASC',
        [sectionIds],
      );
      
      paragraphs.forEach(p => {
        if (!paragraphsMap[p.numbered_section_id]) {
          paragraphsMap[p.numbered_section_id] = [];
        }
        paragraphsMap[p.numbered_section_id].push(p.paragraph_text);
      });
    }

    // Lấy expand bullets
    const { rows: expandBullets } = await pool.query(
      'SELECT * FROM product_expand_bullets WHERE product_detail_id = $1 ORDER BY sort_order ASC',
      [detail.id],
    );

    // Gộp paragraphs vào sections
    const sectionsWithParagraphs = numberedSections.map(section => ({
      id: section.id,
      sectionNo: section.section_no,
      title: section.title,
      // Hỗ trợ cả imageBack/imageFront (mới) và image (cũ) để backward compatible
      imageBack: section.overlay_back_image || section.image || '',
      imageFront: section.overlay_front_image || '',
      image: section.image || '', // Giữ lại để backward compatible
      imageAlt: section.image_alt || '',
      imageSide: section.image_side || 'left',
      overlayBackImage: section.overlay_back_image || '',
      overlayFrontImage: section.overlay_front_image || '',
      paragraphs: paragraphsMap[section.id] || [],
      sortOrder: section.sort_order || 0,
    }));

    return res.json({
      success: true,
      data: {
        id: detail.id,
        productId: detail.product_id,
        slug: detail.slug,
        metaTop: detail.meta_top || '',
        heroDescription: detail.hero_description || '',
        heroImage: detail.hero_image || '',
        ctaContactText: detail.cta_contact_text || '',
        ctaContactHref: detail.cta_contact_href || '',
        ctaDemoText: detail.cta_demo_text || '',
        ctaDemoHref: detail.cta_demo_href || '',
        overviewKicker: detail.overview_kicker || '',
        overviewTitle: detail.overview_title || '',
        overviewCards: overviewCards.map(card => ({
          id: card.id,
          step: card.step,
          title: card.title,
          description: card.description || '',
          sortOrder: card.sort_order || 0,
        })),
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
          bullets: expandBullets.map(b => b.bullet_text),
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
              meta_top = $2,
              hero_description = $3,
              hero_image = $4,
              cta_contact_text = $5,
              cta_contact_href = $6,
              cta_demo_text = $7,
              cta_demo_href = $8,
              overview_kicker = $9,
              overview_title = $10,
              showcase_title = $11,
              showcase_desc = $12,
              showcase_cta_text = $13,
              showcase_cta_href = $14,
              showcase_image_back = $15,
              showcase_image_front = $16,
              expand_title = $17,
              expand_cta_text = $18,
              expand_cta_href = $19,
              expand_image = $20,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $21
          `,
          [
            finalSlug,
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
              product_id, slug, meta_top, hero_description, hero_image,
              cta_contact_text, cta_contact_href, cta_demo_text, cta_demo_href,
              overview_kicker, overview_title,
              showcase_title, showcase_desc, showcase_cta_text, showcase_cta_href,
              showcase_image_back, showcase_image_front,
              expand_title, expand_cta_text, expand_cta_href, expand_image
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
            RETURNING id
          `,
          [
            productId,
            finalSlug,
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
      await client.query('DELETE FROM product_overview_cards WHERE product_detail_id = $1', [detailId]);
      if (overviewCards && overviewCards.length > 0) {
        // Đơn giản hóa: insert từng card một để tránh lỗi mapping tham số
        for (let i = 0; i < overviewCards.length; i++) {
          const card = overviewCards[i];
          await client.query(
            `
              INSERT INTO product_overview_cards (
                product_detail_id,
                step,
                title,
                description,
                sort_order
              )
              VALUES ($1, $2, $3, $4, $5)
            `,
            [
              detailId,
              card.step || i + 1,
              card.title || '',
              card.description || '',
              i,
            ],
          );
        }
      }

      // Xóa và tạo lại showcase bullets
      await client.query('DELETE FROM product_showcase_bullets WHERE product_detail_id = $1', [detailId]);
      if (showcase.bullets && showcase.bullets.length > 0) {
        const bulletParams = [];
        showcase.bullets.forEach((bullet, index) => {
          bulletParams.push(detailId, bullet, index);
        });
        await client.query(
          `INSERT INTO product_showcase_bullets (product_detail_id, bullet_text, sort_order)
           VALUES ${showcase.bullets.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')}`,
          bulletParams,
        );
      }

      // Xóa và tạo lại numbered sections
      await client.query('DELETE FROM product_numbered_sections WHERE product_detail_id = $1', [detailId]);
      if (numberedSections && numberedSections.length > 0) {
        for (let i = 0; i < numberedSections.length; i++) {
          const section = numberedSections[i];
          // Map imageBack và imageFront vào overlay_back_image và overlay_front_image
          const imageBackValue = section.imageBack || section.overlayBackImage || '';
          const imageFrontValue = section.imageFront || section.overlayFrontImage || '';
          // Nếu có imageBack thì dùng làm image chính, nếu không thì dùng image cũ
          const imageValue = section.imageBack || section.image || '';
          
          console.log(`[DEBUG] Saving numbered section ${i}:`, {
            sectionNo: section.sectionNo,
            title: section.title,
            imageBack: section.imageBack,
            imageFront: section.imageFront,
            imageBackValue,
            imageFrontValue,
            imageValue,
          });
          
          const { rows: newSection } = await client.query(
            `
              INSERT INTO product_numbered_sections (
                product_detail_id, section_no, title, image, image_alt, image_side,
                overlay_back_image, overlay_front_image, sort_order
              )
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
              RETURNING id
            `,
            [
              detailId,
              section.sectionNo,
              section.title,
              imageValue,
              section.imageAlt || '',
              section.imageSide || 'left',
              imageBackValue,
              imageFrontValue,
              i,
            ],
          );

          const sectionId = newSection[0].id;

          // Thêm paragraphs cho section này
          if (section.paragraphs && section.paragraphs.length > 0) {
            const paraValues = section.paragraphs.map((_, index) => 
              `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
            ).join(', ');
            const paraParams = [];
            section.paragraphs.forEach((para, index) => {
              paraParams.push(sectionId, para, index);
            });
            await client.query(
              `INSERT INTO product_section_paragraphs (numbered_section_id, paragraph_text, sort_order)
               VALUES ${section.paragraphs.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')}`,
              paraParams,
            );
          }
        }
      }

      // Xóa và tạo lại expand bullets
      await client.query('DELETE FROM product_expand_bullets WHERE product_detail_id = $1', [detailId]);
      if (expand.bullets && expand.bullets.length > 0) {
        const expandParams = [];
        expand.bullets.forEach((bullet, index) => {
          expandParams.push(detailId, bullet, index);
        });
        await client.query(
          `INSERT INTO product_expand_bullets (product_detail_id, bullet_text, sort_order)
           VALUES ${expand.bullets.map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`).join(', ')}`,
          expandParams,
        );
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

