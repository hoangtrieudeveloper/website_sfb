const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const usersRoutes = require('./routes/users.routes');
const rolesRoutes = require('./routes/roles.routes');
const permissionsRoutes = require('./routes/permissions.routes');
const logger = require('./middlewares/logger.middleware');
const notFound = require('./middlewares/notFound.middleware');
const errorHandler = require('./middlewares/error.middleware');
const { swaggerSpec } = require('./config/swagger');
const { testConnection } = require('./config/database');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

// Test database connection on startup
testConnection().catch((err) => {
  console.error('⚠️  Database connection warning:', err.message);
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
// Users for admin area
app.use('/api/admin/users', usersRoutes);
// Roles for admin area
app.use('/api/admin/roles', rolesRoutes);
// Permissions for admin area
app.use('/api/admin/permissions', permissionsRoutes);

// 404 & error handlers
app.use(notFound);
app.use(errorHandler);

module.exports = app;




