const { pool } = require('../config/database');

// Helper function to get section by type (only active)
const getSection = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM contact_sections WHERE section_type = $1 AND is_active = true',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Helper function to get items by section_id and section_type (only active)
const getItems = async (sectionId, sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM contact_section_items WHERE section_id = $1 AND section_type = $2 AND is_active = true ORDER BY sort_order ASC',
    [sectionId, sectionType]
  );
  return rows;
};

// GET /api/public/contact
exports.getContact = async (req, res, next) => {
  try {
    const hero = await getSection('hero');
    const infoCards = await getSection('info-cards');
    const form = await getSection('form');
    const sidebar = await getSection('sidebar');
    const map = await getSection('map');

    let infoCardsItems = [];
    if (infoCards) {
      infoCardsItems = await getItems(infoCards.id, 'info-cards');
    }

    let offices = [];
    let socials = [];
    if (sidebar) {
      offices = await getItems(sidebar.id, 'offices');
      socials = await getItems(sidebar.id, 'socials');
    }

    return res.json({
      success: true,
      data: {
        hero: hero ? {
          badge: hero.data?.badge || '',
          title: hero.data?.title || { prefix: '', highlight: '' },
          description: hero.data?.description || '',
          iconName: hero.data?.iconName || 'MessageCircle',
          image: hero.data?.image || '',
        } : null,
        infoCards: infoCardsItems.map(item => {
          const itemData = item.data || {};
          return {
            iconName: itemData.iconName || '',
            title: itemData.title || '',
            content: itemData.content || '',
            link: itemData.link || null,
            gradient: itemData.gradient || '',
          };
        }),
        form: form ? {
          header: form.data?.header || '',
          description: form.data?.description || '',
          fields: form.data?.fields || {},
          button: form.data?.button || { submit: '', success: '' },
          services: form.data?.services || [],
        } : null,
        sidebar: sidebar ? {
          quickActions: sidebar.data?.quickActions || {},
          offices: offices.map(item => {
            const itemData = item.data || {};
            return {
              city: itemData.city || '',
              address: itemData.address || '',
              phone: itemData.phone || '',
              email: itemData.email || '',
            };
          }),
          socials: socials.map(item => {
            const itemData = item.data || {};
            return {
              iconName: itemData.iconName || '',
              href: itemData.href || '',
              label: itemData.label || '',
              gradient: itemData.gradient || '',
            };
          }),
        } : null,
        map: map ? {
          address: map.data?.address || '',
          iframeSrc: map.data?.iframeSrc || '',
        } : null,
      },
    });
  } catch (error) {
    return next(error);
  }
};

