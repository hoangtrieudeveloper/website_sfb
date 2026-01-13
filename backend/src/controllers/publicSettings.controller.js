const { pool } = require('../config/database');

// Helper function to parse locale field from JSON string
const parseLocaleField = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && ('vi' in parsed || 'en' in parsed || 'ja' in parsed)) {
        return parsed;
      }
    } catch (e) {
      // Not JSON, return as string
    }
    return value;
  }
  return value;
};

// Helper function to get localized text from locale object or string
const getLocalizedText = (value, locale) => {
  if (!value) return '';
  if (typeof value === 'string') {
    // Try to parse as JSON
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === 'object' && ('vi' in parsed || 'en' in parsed || 'ja' in parsed)) {
        return parsed[locale] || parsed.vi || parsed.en || parsed.ja || '';
      }
    } catch (e) {
      // Not JSON, return as string
    }
    return value;
  }
  if (typeof value === 'object' && value !== null) {
    return value[locale] || value.vi || value.en || value.ja || '';
  }
  return String(value);
};

// List of settings keys that should be treated as locale objects
const LOCALE_SETTINGS_KEYS = ['slogan', 'site_name', 'site_description', 'address'];

// GET /api/public/settings
exports.getPublicSettings = async (req, res, next) => {
  try {
    const { keys } = req.query; // Comma-separated list of keys, e.g., ?keys=logo,phone,email
    
    // Get locale from Accept-Language header
    const acceptLanguage = req.headers['accept-language'] || 'vi';
    let locale = 'vi'; // default
    if (acceptLanguage.includes('en')) {
      locale = 'en';
    } else if (acceptLanguage.includes('ja')) {
      locale = 'ja';
    }
    
    let query = 'SELECT setting_key, setting_value FROM site_settings';
    const params = [];
    
    if (keys) {
      const keyArray = keys.split(',').map(k => k.trim());
      query += ' WHERE setting_key = ANY($1)';
      params.push(keyArray);
    }
    
    query += ' ORDER BY setting_key';
    
    const { rows } = await pool.query(query, params);
    
    // Transform to simple key-value object with locale support
    const settings = {};
    rows.forEach(row => {
      const rawValue = row.setting_value || '';
      
      // If this is a locale field, parse and localize it
      if (LOCALE_SETTINGS_KEYS.includes(row.setting_key)) {
        const parsed = parseLocaleField(rawValue);
        settings[row.setting_key] = getLocalizedText(parsed, locale);
      } else {
        // For non-locale fields, return as-is
        settings[row.setting_key] = rawValue;
      }
    });
    
    return res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return next(error);
  }
};


