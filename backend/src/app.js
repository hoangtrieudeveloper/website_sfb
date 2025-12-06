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
const publicNewsRoutes = require('./routes/publicNews.routes');
const publicCategoriesRoutes = require('./routes/publicCategories.routes');
const uploadRoutes = require('./routes/upload.routes');
const mediaFoldersRoutes = require('./routes/mediaFolders.routes');
const mediaFilesRoutes = require('./routes/mediaFiles.routes');
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
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Test database connection on startup
testConnection().catch((err) => {
  console.error('⚠️  Database connection warning:', err.message);
});

// Đảm bảo bảng media được tạo khi khởi động
ensureTablesOnce().then(() => {
  console.log('✅ Media tables ready');
}).catch((err) => {
  console.error('⚠️  Media tables setup warning:', err.message);
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'API SFB is running' });
});

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// RESTful routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Public routes (no authentication required)
app.use('/api/public/news', publicNewsRoutes);
app.use('/api/public/categories', publicCategoriesRoutes);

// Admin protected routes
app.use('/api/admin/users', requireAuth, usersRoutes);
app.use('/api/admin/roles', requireAuth, rolesRoutes);
app.use('/api/admin/permissions', requireAuth, permissionsRoutes);
app.use('/api/admin/news', requireAuth, newsRoutes);
app.use('/api/admin/categories', requireAuth, newsCategoriesRoutes);
app.use('/api/admin/upload', uploadRoutes);
app.use('/api/admin/media/folders', requireAuth, mediaFoldersRoutes);
app.use('/api/admin/media/files', requireAuth, mediaFilesRoutes);

// 404 & error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;




