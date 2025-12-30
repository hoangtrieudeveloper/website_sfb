/**
 * Script để setup Products Management System
 * Chạy: node backend/scripts/setup-products.js
 * Hoặc: npm run setup:products (nếu đã thêm vào package.json)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function setupProducts() {
  console.log('🚀 Starting Products Management System setup...\n');

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
    // Bước 1: Kết nối đến database
    console.log('🔌 Step 1/3: Connecting to database...');
    pool = new Pool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });
    client = await pool.connect();
    console.log('✅ Connected\n');

    // Bước 2: Đọc và chạy products_schema.sql
    console.log('📄 Step 2/3: Reading products_schema.sql...');
    const schemaPath = path.join(__dirname, '..', 'database', 'products_schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('⚙️  Executing Products schema SQL...');
    await client.query(schemaSQL);
    console.log('✅ Products schema executed successfully!\n');

    // Bước 3: Kiểm tra các bảng đã được tạo
    console.log('📊 Step 3/3: Verifying Products tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      AND table_name LIKE 'product%'
      ORDER BY table_name
    `);
    
    console.log(`✅ Found ${result.rows.length} Products table(s):`);
    result.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });

    // Kiểm tra seed data
    const { rows: categories } = await client.query('SELECT COUNT(*) as count FROM product_categories');
    const { rows: benefits } = await client.query('SELECT COUNT(*) as count FROM product_benefits');
    const { rows: hero } = await client.query('SELECT COUNT(*) as count FROM product_page_hero');
    
    console.log('\n📦 Seed data:');
    console.log(`   - Categories: ${categories[0].count}`);
    console.log(`   - Benefits: ${benefits[0].count}`);
    console.log(`   - Hero settings: ${hero[0].count}`);

    console.log('\n🎉 Products Management System setup completed successfully!');
    console.log(`\n💡 Next steps:`);
    console.log('   1. Restart backend server: npm run dev:backend');
    console.log('   2. Access admin panel: http://localhost:3000/admin/products\n');

  } catch (error) {
    console.error('\n❌ Products setup failed:');
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
      console.error('   3. Windows: Start PostgreSQL service from Services');
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed. Check your DB_USER and DB_PASSWORD in .env file.');
    } else if (error.code === '3D000') {
      console.error('\n💡 Database does not exist. Please run: npm run setup');
    } else if (error.message.includes('does not exist') && error.message.includes('function')) {
      console.error('\n💡 Missing function update_updated_at_column().');
      console.error('   Please run the main schema.sql first: npm run setup');
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
setupProducts();

