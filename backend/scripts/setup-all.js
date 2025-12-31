/**
 * Script tổng hợp để setup toàn bộ database
 * Chạy: npm run setup
 * 
 * Script này sẽ:
 * 1. Tạo database nếu chưa tồn tại
 * 2. Chạy schema.sql (tất cả bảng cơ bản)
 * 3. Tạo media tables (media_folders, media_files)
 * 4. Thêm media permissions
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createDatabaseIfNotExists } = require('../src/config/database');

async function setupAll() {
  console.log('🚀 Starting complete database setup...\n');

  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sfb_db',
  };

  console.log('📋 Database configuration:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log('');

  let pool;
  let client;

  try {
    // Bước 1: Tạo database nếu chưa tồn tại
    console.log('📦 Step 1/5: Creating database if not exists...');
    const dbCreated = await createDatabaseIfNotExists();
    if (!dbCreated) {
      console.error('\n❌ Cannot proceed without database. Please check PostgreSQL connection.');
      process.exit(1);
    }
    console.log('✅ Database ready\n');

    // Bước 2: Kết nối đến database
    console.log('🔌 Step 2/5: Connecting to database...');
    pool = new Pool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });
    client = await pool.connect();
    console.log('✅ Connected\n');

    // Bước 3: Chạy schema.sql (bao gồm tất cả: bảng cơ bản + products + industries + about + media tables + permissions)
    console.log('📄 Step 3/4: Running complete schema (schema.sql)...');
    console.log('   This includes: main tables, products, industries, about, media tables, and permissions');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSQL);
    console.log('✅ Complete schema executed (includes all modules: products, industries, about, media, and permissions)\n');

    // Kiểm tra các bảng đã được tạo
    console.log('📊 Step 4/4: Verifying tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log(`✅ Found ${result.rows.length} table(s):`);
    result.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n🎉 Database setup completed successfully!');
    console.log(`\n📝 Summary:`);
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Tables: ${result.rows.length} tables created`);
    console.log('\n💡 Next steps:');
    console.log('   1. Start backend server: npm start');
    console.log('   2. Media tables will auto-create on startup if needed');
    console.log('   3. Access admin panel: http://localhost:3000/admin\n');

  } catch (error) {
    console.error('\n❌ Database setup failed:');
    console.error(`Error: ${error.message}`);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    if (error.detail) {
      console.error(`Detail: ${error.detail}`);
    }
    
    // Hiển thị hướng dẫn dựa trên loại lỗi
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Make sure PostgreSQL is installed and running');
      console.error('   2. Check your .env file configuration');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed. Check your DB_USER and DB_PASSWORD in .env file.');
    } else if (error.code === '3D000') {
      console.error('\n💡 Database does not exist. The setup script should create it automatically.');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    if (pool) {
      await pool.end();
    }
  }
}

// Chạy setup
setupAll();
