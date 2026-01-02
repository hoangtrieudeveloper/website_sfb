# Backend Dockerfile
FROM node:20-alpine

# Install build dependencies for native modules (if needed)
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install dependencies
# Use npm install (more flexible than npm ci)
RUN npm install --only=production --no-audit --no-fund

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads/media uploads/news

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 1

# Start application
CMD ["node", "server.js"]

