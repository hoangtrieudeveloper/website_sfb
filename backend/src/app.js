const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const usersRoutes = require('./routes/users.routes');
const rolesRoutes = require('./routes/roles.routes');
const permissionsRoutes = require('./routes/permissions.routes');
const newsRoutes = require('./routes/news.routes');
const newsCategoriesRoutes = require('./routes/newsCategories.routes');
const menuRoutes = require('./routes/menu.routes');
const publicNewsRoutes = require('./routes/publicNews.routes');
const publicCategoriesRoutes = require('./routes/publicCategories.routes');
const publicCareersRoutes = require('./routes/publicCareers.routes');
const publicHomepageRoutes = require('./routes/publicHomepage.routes');
const publicIndustriesRoutes = require('./routes/publicIndustries.routes');
const publicAboutRoutes = require('./routes/publicAbout.routes');
const publicProductsRoutes = require('./routes/publicProducts.routes');
const publicContactRoutes = require('./routes/publicContact.routes');
const publicSeoRoutes = require('./routes/publicSeo.routes');
const publicSettingsRoutes = require('./routes/publicSettings.routes');
const publicMenuRoutes = require('./routes/publicMenu.routes');
const uploadRoutes = require('./routes/upload.routes');
const mediaFoldersRoutes = require('./routes/mediaFolders.routes');
const mediaFilesRoutes = require('./routes/mediaFiles.routes');
const productsRoutes = require('./routes/products.routes');
const testimonialsRoutes = require('./routes/testimonials.routes');
const industriesRoutes = require('./routes/industries.routes');
const aboutRoutes = require('./routes/about.routes');
const careersRoutes = require('./routes/careers.routes');
const homepageRoutes = require('./routes/homepage.routes');
const contactRoutes = require('./routes/contact.routes');
const seoRoutes = require('./routes/seo.routes');
const settingsRoutes = require('./routes/settings.routes');
const translationRoutes = require('./routes/translation.routes');
const healthRoutes = require('./routes/health.routes');
const requireAuth = require('./middlewares/auth.middleware');
const logger = require('./middlewares/logger.middleware');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/error.middleware');
const { swaggerSpec } = require('./config/swagger');
const { testConnection } = require('./config/database');
const { ensureTablesOnce } = require('./utils/ensureMediaTables');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Serve static files from uploads directory
// Đảm bảo static files được serve trước các routes khác
const uploadsPath = path.join(__dirname, '../uploads');

// Serve static files với options tối ưu
app.use('/uploads', express.static(uploadsPath, {
  dotfiles: 'ignore',
  etag: true,
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: (res, filePath) => {
    // Set proper content-type headers
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') {
      res.setHeader('Content-Type', 'image/jpeg');
    } else if (ext === '.png') {
      res.setHeader('Content-Type', 'image/png');
    } else if (ext === '.gif') {
      res.setHeader('Content-Type', 'image/gif');
    } else if (ext === '.webp') {
      res.setHeader('Content-Type', 'image/webp');
    } else if (ext === '.svg') {
      res.setHeader('Content-Type', 'image/svg+xml');
    }
    // Enable CORS for images
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
  }
}));

// Test database connection on startup
testConnection().catch((err) => {
  console.error('⚠️  Database connection warning:', err.message);
});

// Đảm bảo bảng media được tạo khi khởi động
ensureTablesOnce().then(() => {
}).catch((err) => {
  console.error('⚠️  Media tables setup warning:', err.message);
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'API SFB is running' });
});

// Health check route
app.use('/api', healthRoutes);

// Swagger UI - Chỉ bật trên development hoặc yêu cầu xác thực trên production
if (process.env.NODE_ENV !== 'production') {
  // Development: Swagger không cần auth
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
  // Production: Swagger yêu cầu Bearer token (giống admin routes)
  app.use('/api-docs', requireAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// RESTful routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Public routes (no authentication required)
app.use('/api/public/news', publicNewsRoutes);
app.use('/api/public/categories', publicCategoriesRoutes);
app.use('/api/public/careers', publicCareersRoutes);
app.use('/api/public/homepage', publicHomepageRoutes);
app.use('/api/public/industries', publicIndustriesRoutes);
app.use('/api/public/about', publicAboutRoutes);
app.use('/api/public/products', publicProductsRoutes);
app.use('/api/public/contact', publicContactRoutes);
app.use('/api/public/seo', publicSeoRoutes);
app.use('/api/public/settings', publicSettingsRoutes);
app.use('/api/public/menus', publicMenuRoutes);

// Admin protected routes
app.use('/api/admin/users', requireAuth, usersRoutes);
app.use('/api/admin/roles', requireAuth, rolesRoutes);
app.use('/api/admin/permissions', requireAuth, permissionsRoutes);
app.use('/api/admin/news', requireAuth, newsRoutes);
app.use('/api/admin/categories', requireAuth, newsCategoriesRoutes);
app.use('/api/admin/menus', requireAuth, menuRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin/media/folders', requireAuth, mediaFoldersRoutes);
app.use('/api/admin/media/files', requireAuth, mediaFilesRoutes);
// Products routes - tất cả routes đã được gộp vào products.routes.js
app.use('/api/admin/products', requireAuth, productsRoutes);
// Testimonials routes
app.use('/api/admin/testimonials', requireAuth, testimonialsRoutes);
// Industries routes
app.use('/api/admin/industries', requireAuth, industriesRoutes);
// About routes
app.use('/api/admin/about', requireAuth, aboutRoutes);
// Careers routes
app.use('/api/admin/careers', requireAuth, careersRoutes);
// Homepage routes
app.use('/api/admin/homepage', requireAuth, homepageRoutes);
// Contact routes
app.use('/api/admin/contact', requireAuth, contactRoutes);
// SEO routes
app.use('/api/admin/seo', requireAuth, seoRoutes);
// Settings routes
app.use('/api/admin/settings', requireAuth, settingsRoutes);
// Translation routes
app.use('/api/admin/translate', translationRoutes);

// 404 & error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;




