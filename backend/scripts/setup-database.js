require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createDatabaseIfNotExists } = require('../src/config/database');

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  // Đọc cấu hình database
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sfb_db',
  };

  // Hiển thị cấu hình đang sử dụng
  console.log('📋 Database configuration:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   User: ${dbConfig.user}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log('');

  try {
    // Bước 1: Tạo database nếu chưa tồn tại
    console.log('📦 Step 1: Creating database if not exists...');
    const dbCreated = await createDatabaseIfNotExists();
    if (!dbCreated) {
      console.error('\n❌ Cannot proceed without database. Please check PostgreSQL connection.');
      process.exit(1);
    }

    // Bước 2: Kết nối đến database
    console.log('🔌 Step 2: Connecting to database...');
    const pool = new Pool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });

    // Bước 3: Đọc và thực thi file SQL
    console.log('📄 Step 3: Reading schema file...');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }

    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('⚙️  Step 4: Executing schema SQL...');
    // PostgreSQL hỗ trợ multiple statements mặc định
    await pool.query(schemaSQL);
    
    console.log('✅ Step 5: Schema executed successfully!');

    // Bước 4: Kiểm tra các bảng đã được tạo
    console.log('\n📊 Step 6: Verifying tables...');
    const result = await pool.query(`
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

    await pool.end();
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log(`\n📝 Database: ${dbConfig.database}`);
    console.log(`🌐 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`👤 User: ${dbConfig.user}`);
    
  } catch (error) {
    console.error('\n❌ Database setup failed:');
    console.error(`Error: ${error.message}`);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    
    // Hiển thị hướng dẫn dựa trên loại lỗi
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Troubleshooting:');
      console.error('   1. Make sure PostgreSQL is installed');
      console.error('   2. Start PostgreSQL service:');
      console.error('      - Windows: Start PostgreSQL service from Services');
      console.error('      - Or run: net start postgresql-x64-XX (replace XX with version)');
      console.error('   3. Check your .env file configuration:');
      console.error(`      DB_HOST=${dbConfig.host}`);
      console.error(`      DB_PORT=${dbConfig.port}`);
      console.error(`      DB_USER=${dbConfig.user}`);
      console.error(`      DB_NAME=${dbConfig.database}`);
    } else if (error.code === '28P01') {
      console.error('\n💡 Authentication failed. Check your DB_USER and DB_PASSWORD in .env file.');
    } else if (error.code === '3D000') {
      console.error('\n💡 Database does not exist. The setup script should create it automatically.');
    }
    
    process.exit(1);
  }
}

// Chạy setup
setupDatabase();
