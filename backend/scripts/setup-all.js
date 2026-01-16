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

    // Bước 3: Chạy schema.sql (bao gồm tất cả: bảng cơ bản + products + industries + about + contact + media tables + permissions)
    console.log('📄 Step 3/5: Running complete schema (schema.sql)...');
    console.log('   This includes: main tables, products (optimized), industries, about, contact, media tables, and permissions');
    const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found at: ${schemaPath}`);
    }
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSQL);
    console.log('✅ Complete schema executed (includes: products_sections, products_section_items, contact_sections, contact_section_items)\n');


    // Bước 3.5: Đảm bảo cột features tồn tại trong products table (cho database cũ)
    console.log('🔧 Step 3.5/5: Ensuring products.features column exists...');
    try {
      const { rows: columnCheck } = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'features'
      `);

      if (columnCheck.length === 0) {
        console.log('   Adding features column to products table...');
        await client.query(`
          ALTER TABLE products 
          ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb
        `);
        await client.query(`
          CREATE INDEX IF NOT EXISTS idx_products_features_gin 
          ON products USING GIN (features)
        `);
        console.log('   ✅ Added features column\n');
      } else {
        console.log('   ✅ Features column already exists\n');
      }
    } catch (err) {
      console.log(`   ⚠️  Warning: ${err.message}\n`);
    }

    // Bước 4: Migrate data từ bảng cũ sang bảng mới (optimized)
    console.log('🔄 Step 4/5: Migrating products data to optimized tables...');
    console.log('   Migrating: product_features -> products.features (JSONB)');
    console.log('   Migrating: product_page_hero -> products_sections (hero)');
    console.log('   Migrating: product_list_header -> products_sections (list-header)');
    console.log('   Migrating: product_benefits -> products_section_items');
    
    const { Pool: MigratePool } = require('pg');
    const migratePool = new MigratePool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    });

    try {
      // Migrate product_features -> products.features
      let productsWithFeatures = [];
      try {
        const result = await migratePool.query(`
          SELECT p.id, p.features,
                 COALESCE(
                   (SELECT jsonb_agg(feature_text ORDER BY sort_order)
                    FROM product_features 
                    WHERE product_id = p.id), 
                   '[]'::jsonb
                 ) as old_features
          FROM products p
          WHERE EXISTS (SELECT 1 FROM product_features WHERE product_id = p.id)
             OR (p.features IS NULL OR p.features = '[]'::jsonb)
        `);
        productsWithFeatures = result.rows;

        for (const product of productsWithFeatures) {
          const oldFeatures = product.old_features;
          const features = Array.isArray(oldFeatures) ? oldFeatures : [];
          // Chỉ update nếu có features từ bảng cũ hoặc products.features đang null/empty
          if (features.length > 0 || !product.features || JSON.stringify(product.features) === '[]') {
            await migratePool.query(
              'UPDATE products SET features = $1 WHERE id = $2',
              [JSON.stringify(features), product.id]
            );
          }
        }
        console.log(`   ✅ Migrated features for ${productsWithFeatures.length} products`);
      } catch (err) {
        console.log(`   ⚠️  Features migration skipped: ${err.message}`);
      }

      // Migrate product_page_hero
      let heroRows = [];
      try {
        const result = await migratePool.query(`
          SELECT * FROM product_page_hero WHERE is_active = true ORDER BY id DESC LIMIT 1
        `);
        heroRows = result.rows;
      } catch (err) {
        console.log(`   ⚠️  Hero migration skipped: ${err.message}`);
      }
      
      if (heroRows.length > 0) {
        const hero = heroRows[0];
        await migratePool.query(`
          INSERT INTO products_sections (section_type, data, is_active)
          VALUES ('hero', $1, $2)
          ON CONFLICT (section_type) 
          DO UPDATE SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
        `, [JSON.stringify({
          title: hero.title || '',
          subtitle: hero.subtitle || '',
          description: hero.description || '',
          primaryCtaText: hero.primary_cta_text || '',
          primaryCtaLink: hero.primary_cta_link || '',
          secondaryCtaText: hero.secondary_cta_text || '',
          secondaryCtaLink: hero.secondary_cta_link || '',
          stat1Label: hero.stat_1_label || '',
          stat1Value: hero.stat_1_value || '',
          stat2Label: hero.stat_2_label || '',
          stat2Value: hero.stat_2_value || '',
          stat3Label: hero.stat_3_label || '',
          stat3Value: hero.stat_3_value || '',
          backgroundGradient: hero.background_gradient || '',
        }), hero.is_active]);
        console.log(`   ✅ Migrated product_page_hero`);
      }

      // Migrate product_list_header
      let listHeaderRows = [];
      try {
        const result = await migratePool.query(`
          SELECT * FROM product_list_header WHERE is_active = true ORDER BY id DESC LIMIT 1
        `);
        listHeaderRows = result.rows;
      } catch (err) {
        console.log(`   ⚠️  List header migration skipped: ${err.message}`);
      }
      
      if (listHeaderRows.length > 0) {
        const header = listHeaderRows[0];
        await migratePool.query(`
          INSERT INTO products_sections (section_type, data, is_active)
          VALUES ('list-header', $1, $2)
          ON CONFLICT (section_type) 
          DO UPDATE SET data = $1, is_active = $2, updated_at = CURRENT_TIMESTAMP
        `, [JSON.stringify({
          subtitle: header.subtitle || '',
          title: header.title || '',
          description: header.description || '',
        }), header.is_active]);
        console.log(`   ✅ Migrated product_list_header`);
      }

      // Migrate product_benefits
      let benefitsRows = [];
      try {
        let { rows: benefitsSection } = await migratePool.query(`
          SELECT id FROM products_sections WHERE section_type = 'benefits' LIMIT 1
        `);
        let benefitsSectionId;
        if (benefitsSection.length === 0) {
          const { rows: newSection } = await migratePool.query(`
            INSERT INTO products_sections (section_type, data, is_active)
            VALUES ('benefits', '{}'::jsonb, true)
            RETURNING id
          `);
          benefitsSectionId = newSection[0].id;
        } else {
          benefitsSectionId = benefitsSection[0].id;
        }

        const result = await migratePool.query(`
          SELECT * FROM product_benefits ORDER BY sort_order ASC, id ASC
        `);
        benefitsRows = result.rows;
        
        for (const benefit of benefitsRows) {
        await migratePool.query(`
          INSERT INTO products_section_items (section_id, section_type, data, sort_order, is_active)
          VALUES ($1, 'benefits', $2, $3, $4)
          ON CONFLICT DO NOTHING
        `, [
          benefitsSectionId,
          JSON.stringify({
            icon: benefit.icon || '',
            title: benefit.title || '',
            description: benefit.description || '',
            gradient: benefit.gradient || '',
          }),
          benefit.sort_order || 0,
          benefit.is_active !== undefined ? benefit.is_active : true
        ]);
        }
        console.log(`   ✅ Migrated ${benefitsRows.length} benefits`);
      } catch (err) {
        console.log(`   ⚠️  Benefits migration skipped: ${err.message}`);
      }

      await migratePool.end();
      console.log(`\n✅ Migration summary:`);
      console.log(`   - ${productsWithFeatures.length} products (features migrated to JSONB)`);
      console.log(`   - ${heroRows.length > 0 ? '1' : '0'} hero section`);
      console.log(`   - ${listHeaderRows.length > 0 ? '1' : '0'} list header`);
      console.log(`   - ${benefitsRows.length || 0} benefits\n`);

      // Bước 4.5: Xóa các bảng deprecated sau khi migration
      console.log('🗑️  Step 4.5/5: Dropping deprecated tables...');
      const deprecatedTables = [
        'product_features',
        'product_page_hero',
        'product_list_header',
        'product_contact_banner',
        'product_benefits',
        'product_overview_cards',
        'product_showcase_bullets',
        'product_numbered_sections',
        'product_section_paragraphs',
        'product_expand_bullets',
      ];

      for (const tableName of deprecatedTables) {
        try {
          const { rows: tableCheck } = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = $1
          `, [tableName]);

          if (tableCheck.length > 0) {
            await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE`);
            console.log(`   ✅ Dropped: ${tableName}`);
          }
        } catch (dropError) {
          console.log(`   ⚠️  Could not drop ${tableName}: ${dropError.message}`);
        }
      }
      
      // Xóa contact-banner section từ products_sections nếu có
      try {
        await client.query(`DELETE FROM products_sections WHERE section_type = 'contact-banner'`);
        console.log(`   ✅ Removed contact-banner section from products_sections`);
      } catch (err) {
        console.log(`   ⚠️  Could not remove contact-banner section: ${err.message}`);
      }
      
      console.log('   ✅ Deprecated tables cleanup completed\n');
    } catch (migrateError) {
      console.log(`⚠️  Migration warning: ${migrateError.message}`);
      console.log(`   This is normal if old tables don't exist yet.\n`);
      if (migratePool) {
        await migratePool.end();
      }
    }

    // Kiểm tra các bảng đã được tạo
    console.log('📊 Step 5/5: Verifying tables...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log(`✅ Found ${result.rows.length} table(s):`);
    
    // Phân loại các bảng
    const optimizedTables = result.rows.filter(r => 
      r.table_name.includes('products_sections') || 
      r.table_name.includes('products_section_items')
    );
    const contactTables = result.rows.filter(r => 
      r.table_name.includes('contact_sections') || 
      r.table_name.includes('contact_section_items')
    );
    const oldProductTables = result.rows.filter(r => 
      r.table_name.startsWith('product_') && 
      !r.table_name.includes('products_sections') &&
      !r.table_name.includes('products_section_items') &&
      r.table_name !== 'products' &&
      r.table_name !== 'product_categories' &&
      r.table_name !== 'product_details'
    );
    
    if (optimizedTables.length > 0) {
      console.log('\n   📦 Optimized Products tables (NEW - đang sử dụng):');
      optimizedTables.forEach((row) => {
        console.log(`      ✅ ${row.table_name}`);
      });
    }
    
    if (contactTables.length > 0) {
      console.log('\n   📧 Contact tables:');
      contactTables.forEach((row) => {
        console.log(`      ✅ ${row.table_name}`);
      });
    }
    
    if (oldProductTables.length > 0) {
      console.log('\n   📋 Legacy Products tables (cũ - đã được xóa):');
      oldProductTables.forEach((row) => {
        console.log(`      ❌ ${row.table_name} (removed)`);
      });
    }
    
    const otherTables = result.rows.filter(r => 
      !r.table_name.includes('products_sections') &&
      !r.table_name.includes('products_section_items') &&
      !r.table_name.includes('contact_sections') &&
      !r.table_name.includes('contact_section_items') &&
      !oldProductTables.some(ot => ot.table_name === r.table_name)
    );
    
    if (otherTables.length > 0) {
      console.log('\n   📊 Other tables:');
      otherTables.forEach((row) => {
        console.log(`      - ${row.table_name}`);
      });
    }

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
