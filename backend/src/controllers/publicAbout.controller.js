const { pool } = require('../config/database');

// Helper function to get section by type (only active)
const getSection = async (sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM about_sections WHERE section_type = $1 AND is_active = true',
    [sectionType]
  );
  return rows.length > 0 ? rows[0] : null;
};

// Helper function to get items by section_id and section_type (only active)
const getItems = async (sectionId, sectionType) => {
  const { rows } = await pool.query(
    'SELECT * FROM about_section_items WHERE section_id = $1 AND section_type = $2 AND is_active = true ORDER BY sort_order ASC',
    [sectionId, sectionType]
  );
  return rows;
};

// GET /api/public/about/hero
exports.getPublicAboutHero = async (req, res, next) => {
  try {
    const section = await getSection('hero');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    return res.json({
      success: true,
      data: {
        id: section.id,
        sectionType: 'hero',
        data: {
          titleLine1: data.titleLine1 || '',
          titleLine2: data.titleLine2 || '',
          titleLine3: data.titleLine3 || '',
          description: data.description || '',
          buttonText: data.buttonText || '',
          buttonLink: data.buttonLink || '',
          image: data.image || '',
          backgroundGradient: data.backgroundGradient || '',
        },
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/about/company
exports.getPublicAboutCompany = async (req, res, next) => {
  try {
    const section = await getSection('company');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const contacts = await getItems(section.id, 'company');

    return res.json({
      success: true,
      data: {
        id: section.id,
        sectionType: 'company',
        data: {
          headerSub: data.headerSub || '',
          headerTitleLine1: data.headerTitleLine1 || '',
          headerTitleLine2: data.headerTitleLine2 || '',
          contentImage1: data.contentImage1 || '',
          contentTitle: data.contentTitle || '',
          contentDescription: data.contentDescription || '',
          contentButtonText: data.contentButtonText || '',
          contentButtonLink: data.contentButtonLink || '',
          contactImage2: data.contactImage2 || '',
          contactButtonText: data.contactButtonText || '',
          contactButtonLink: data.contactButtonLink || '',
          contacts: contacts.map(c => {
            const itemData = c.data || {};
            return {
              id: c.id,
              iconName: itemData.iconName || 'Building2',
              title: itemData.title || '',
              text: itemData.text || '',
              isHighlight: itemData.isHighlight || false,
              sortOrder: c.sort_order || 0,
            };
          }),
        },
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/about/vision-mission
exports.getPublicAboutVisionMission = async (req, res, next) => {
  try {
    const section = await getSection('vision-mission');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const items = await getItems(section.id, 'vision-mission');

    return res.json({
      success: true,
      data: {
        id: section.id,
        sectionType: 'vision-mission',
        data: {
          headerTitle: data.headerTitle || '',
          headerDescription: data.headerDescription || '',
          items: items.map(i => {
            const itemData = i.data || {};
            return {
              id: i.id,
              text: itemData.text || '',
              sortOrder: i.sort_order || 0,
            };
          }),
        },
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/about/core-values
exports.getPublicAboutCoreValues = async (req, res, next) => {
  try {
    const section = await getSection('core-values');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const items = await getItems(section.id, 'core-values');

    return res.json({
      success: true,
      data: {
        id: section.id,
        sectionType: 'core-values',
        data: {
          headerTitle: data.headerTitle || '',
          headerDescription: data.headerDescription || '',
          items: items.map(i => {
            const itemData = i.data || {};
            return {
              id: i.id,
              iconName: itemData.iconName || 'Lightbulb',
              title: itemData.title || '',
              description: itemData.description || '',
              gradient: itemData.gradient || '',
              sortOrder: i.sort_order || 0,
              isActive: i.is_active !== undefined ? i.is_active : true,
            };
          }),
        },
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/about/milestones
exports.getPublicAboutMilestones = async (req, res, next) => {
  try {
    const section = await getSection('milestones');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const items = await getItems(section.id, 'milestones');

    return res.json({
      success: true,
      data: {
        id: section.id,
        sectionType: 'milestones',
        data: {
          headerTitle: data.headerTitle || '',
          headerDescription: data.headerDescription || '',
          items: items.map(i => {
            const itemData = i.data || {};
            return {
              id: i.id,
              year: itemData.year || '',
              title: itemData.title || '',
              description: itemData.description || '',
              icon: itemData.icon || '🚀',
              sortOrder: i.sort_order || 0,
              isActive: i.is_active !== undefined ? i.is_active : true,
            };
          }),
        },
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

// GET /api/public/about/leadership
exports.getPublicAboutLeadership = async (req, res, next) => {
  try {
    const section = await getSection('leadership');
    
    if (!section) {
      return res.json({
        success: true,
        data: null,
      });
    }

    const data = section.data || {};
    const items = await getItems(section.id, 'leadership');

    return res.json({
      success: true,
      data: {
        id: section.id,
        sectionType: 'leadership',
        data: {
          headerTitle: data.headerTitle || '',
          headerDescription: data.headerDescription || '',
          items: items.map(i => {
            const itemData = i.data || {};
            return {
              id: i.id,
              name: itemData.name || '',
              position: itemData.position || '',
              email: itemData.email || '',
              phone: itemData.phone || '',
              description: itemData.description || '',
              image: itemData.image || '',
              sortOrder: i.sort_order || 0,
              isActive: i.is_active !== undefined ? i.is_active : true,
            };
          }),
        },
        isActive: section.is_active !== undefined ? section.is_active : true,
        createdAt: section.created_at,
        updatedAt: section.updated_at,
      },
    });
  } catch (error) {
    return next(error);
  }
};

