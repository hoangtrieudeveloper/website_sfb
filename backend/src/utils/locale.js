/**
 * Helper function để apply locale cho data object
 * Chuyển đổi tất cả các field có locale object thành string theo locale hiện tại
 */
function applyLocaleToData(data, locale = 'vi') {
  if (!data || typeof data !== 'object') return data;
  
  // Nếu là array
  if (Array.isArray(data)) {
    return data.map(item => applyLocaleToData(item, locale));
  }
  
  const result = {};
  
  // Danh sách các field không cần dịch (giữ nguyên)
  const nonTranslatableFields = [
    'image', 'link', 'href', 'url', 'icon', 'gradient', 'color', 
    'partners', 'heroImage', 'backgroundImage', 'imageUrl', 'slug',
    'id', 'sortOrder', 'isActive', 'createdAt', 'updatedAt',
    'publishedDate', 'author', 'readTime', 'categoryName', 'categoryId',
    'isFeatured', 'excerpt'
  ];
  
  for (const [key, value] of Object.entries(data)) {
    // Skip non-translatable fields
    if (nonTranslatableFields.includes(key)) {
      result[key] = value;
      continue;
    }
    
    if (value === null || value === undefined) {
      result[key] = value;
      continue;
    }
    
    // Nếu là locale object {vi, en, ja}
    if (typeof value === 'object' && !Array.isArray(value)) {
      if ('vi' in value || 'en' in value || 'ja' in value) {
        // Lấy giá trị theo locale, fallback về vi -> en -> ja
        result[key] = value[locale] || value.vi || value.en || value.ja || '';
      } else {
        // Recursively process nested objects
        result[key] = applyLocaleToData(value, locale);
      }
    } 
    // Nếu là array
    else if (Array.isArray(value)) {
      result[key] = value.map(item => {
        if (typeof item === 'object' && item !== null) {
          return applyLocaleToData(item, locale);
        }
        return item;
      });
    }
    // Giữ nguyên các giá trị khác (string, number, boolean)
    else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Validate locale
 */
function validateLocale(locale) {
  const validLocales = ['vi', 'en', 'ja'];
  return validLocales.includes(locale) ? locale : 'vi';
}

/**
 * Get locale from request (query param or header)
 */
function getLocaleFromRequest(req) {
  const locale = req.query?.locale || req.headers?.['accept-language']?.split(',')[0]?.split('-')[0] || 'vi';
  return validateLocale(locale);
}

/**
 * Get localized value from locale object or string
 */
function getLocalizedValue(value, locale = 'vi') {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && !Array.isArray(value)) {
    if ('vi' in value || 'en' in value || 'ja' in value) {
      return value[locale] || value.vi || value.en || value.ja || '';
    }
  }
  return String(value);
}

module.exports = {
  applyLocaleToData,
  validateLocale,
  getLocaleFromRequest,
  getLocalizedValue
};

