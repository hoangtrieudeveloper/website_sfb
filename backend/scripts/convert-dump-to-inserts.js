const fs = require('fs');
const path = require('path');

const dumpFile = path.join(__dirname, '../../dump-sfb_db-202601140944.sql');
const outputFile = path.join(__dirname, '../../dump-data-inserts-only.sql');

console.log('📦 Converting COPY blocks to INSERT statements for DBeaver...');

// Đọc file dump
const dumpContent = fs.readFileSync(dumpFile, 'utf8');
const lines = dumpContent.split('\n');

// Hàm escape SQL string
function escapeSqlString(str) {
  if (str === null || str === undefined || str === '\\N') {
    return 'NULL';
  }
  // Escape single quotes
  return `'${String(str).replace(/'/g, "''")}'`;
}

// Hàm parse COPY header để lấy table và columns
function parseCopyHeader(header) {
  const match = header.match(/COPY public\.(\w+)\s*\(([^)]+)\)/);
  if (!match) return null;
  return {
    table: match[1],
    columns: match[2].split(',').map(c => c.trim())
  };
}

// Hàm chuyển đổi COPY data thành INSERT statements
function convertCopyToInsert(copySection) {
  const headerInfo = parseCopyHeader(copySection.header);
  if (!headerInfo) {
    console.warn(`⚠️  Could not parse header: ${copySection.header}`);
    return '';
  }

  const { table, columns } = headerInfo;
  const dataLines = copySection.data.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed && trimmed !== '\\.' && !trimmed.startsWith('COPY');
  });

  if (dataLines.length === 0) {
    return `-- ${table}: No data\n`;
  }

  let insertStatements = `-- ============================================\n`;
  insertStatements += `-- Table: ${table}\n`;
  insertStatements += `-- ============================================\n`;
  insertStatements += `INSERT INTO ${table} (${columns.join(', ')}) VALUES\n`;

  // Determine which columns are numeric/boolean/jsonb
  const numericColumns = new Set();
  const booleanColumns = new Set();
  const jsonbColumns = new Set();
  
  columns.forEach((col, idx) => {
    const colLower = col.toLowerCase();
    // ID columns - first column named 'id' is usually numeric
    if (colLower === 'id' && idx === 0) {
      numericColumns.add(idx);
    }
    // Other _id columns that are numeric
    else if (colLower.endsWith('_id') && colLower !== 'category_id' && colLower !== 'parent_code' && 
             !colLower.includes('section_id') && colLower !== 'folder_id' && colLower !== 'product_detail_id') {
      numericColumns.add(idx);
    }
    // Boolean columns
    if (colLower.startsWith('is_') || colLower === 'is_active' || colLower === 'is_featured' || colLower === 'is_default' || 
        colLower.includes('show_') || colLower.includes('enable_') || colLower.includes('highlight_')) {
      booleanColumns.add(idx);
    }
    // JSONB columns
    if (colLower.includes('images') || colLower === 'data' || colLower.includes('features') || colLower.includes('structured_data')) {
      jsonbColumns.add(idx);
    }
  });

  const values = [];
  for (const line of dataLines) {
    if (!line.trim() || line.trim() === '\\.') continue;
    
    // Parse tab-separated values
    const parts = line.split('\t');
    
    if (parts.length !== columns.length) {
      console.warn(`⚠️  Line has ${parts.length} parts but expected ${columns.length} columns for ${table}`);
      continue;
    }

    // Convert values, handling NULL and escaping strings
    const rowValues = parts.map((val, idx) => {
      const trimmedVal = val.trim();
      if (trimmedVal === '\\N' || trimmedVal === '') {
        return 'NULL';
      }
      
      // Handle numeric columns
      if (numericColumns.has(idx)) {
        let numVal = trimmedVal.replace(/^['"]+|['"]+$/g, '').trim();
        if (/^\d+$/.test(numVal)) {
          return numVal; // Return without quotes for numeric
        }
        return 'NULL';
      }
      
      // Handle boolean columns
      if (booleanColumns.has(idx)) {
        if (trimmedVal === 't' || trimmedVal === 'TRUE' || trimmedVal === 'true') {
          return 'TRUE';
        }
        if (trimmedVal === 'f' || trimmedVal === 'FALSE' || trimmedVal === 'false') {
          return 'FALSE';
        }
      }
      
      // Check if it's a JSON/JSONB value (starts with { or [)
      if (jsonbColumns.has(idx) || trimmedVal.startsWith('{') || trimmedVal.startsWith('[')) {
        // It's JSON, escape it properly and cast to JSONB
        return escapeSqlString(trimmedVal) + '::jsonb';
      }
      
      // Regular string value
      return escapeSqlString(trimmedVal);
    });

    values.push(`(${rowValues.join(', ')})`);
  }

  if (values.length === 0) {
    return `-- ${table}: No valid data\n`;
  }

  // Chia thành các batch để tránh query quá dài
  const batchSize = 100;
  let result = '';
  
  for (let i = 0; i < values.length; i += batchSize) {
    const batch = values.slice(i, i + batchSize);
    result += batch.join(',\n') + ';\n\n';
  }

  return result;
}

// Tìm tất cả các phần COPY
const copySections = [];
let inCopySection = false;
let currentCopy = null;
let currentLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Bắt đầu một phần COPY
  if (line.startsWith('COPY public.')) {
    inCopySection = true;
    currentCopy = {
      header: line,
      startLine: i,
      data: []
    };
    currentLines = [line];
    continue;
  }
  
  // Kết thúc phần COPY
  if (inCopySection && line.trim() === '\\.') {
    currentCopy.endLine = i;
    currentCopy.data = currentLines.join('\n');
    copySections.push(currentCopy);
    inCopySection = false;
    currentCopy = null;
    currentLines = [];
    continue;
  }
  
  // Thu thập dữ liệu trong phần COPY
  if (inCopySection) {
    currentLines.push(line);
  }
}

console.log(`✅ Found ${copySections.length} COPY sections`);

// Thứ tự insert (quan trọng cho foreign keys)
const orderedTables = [
  'news_categories',
  'news',
  'roles',
  'users',
  'permissions',
  'role_permissions',
  'product_categories',
  'products',
  'product_details',
  'products_sections',
  'products_section_items',
  'menus',
  'media_folders',
  'media_files',
  'testimonials',
  'industries',
  'industries_sections',
  'industries_section_items',
  'about_sections',
  'about_section_items',
  'career_sections',
  'career_section_items',
  'homepage_blocks',
  'contact_sections',
  'contact_section_items',
  'contact_requests',
  'seo_pages',
  'site_settings'
];

// Sắp xếp các phần COPY theo thứ tự
const sortedCopySections = [];
for (const tableName of orderedTables) {
  const section = copySections.find(s => s.header.includes(`COPY public.${tableName}`));
  if (section) {
    sortedCopySections.push(section);
  }
}

// Thêm các phần COPY còn lại (nếu có)
for (const section of copySections) {
  if (!sortedCopySections.includes(section)) {
    sortedCopySections.push(section);
  }
}

// Tạo file output
let outputContent = `-- ============================================\n`;
outputContent += `-- DATA ONLY - INSERT statements from dump\n`;
outputContent += `-- Generated from: dump-sfb_db-202601140944.sql\n`;
outputContent += `-- Use this file in DBeaver SQL Editor\n`;
outputContent += `-- ============================================\n\n`;

// Chuyển đổi và ghi các phần INSERT
let insertCount = 0;
for (const section of sortedCopySections) {
  const insertStatements = convertCopyToInsert(section);
  if (insertStatements) {
    outputContent += insertStatements;
    insertCount++;
  }
}

// Thêm SETVAL cho sequences
outputContent += '\n-- ============================================\n';
outputContent += '-- SET SEQUENCE VALUES\n';
outputContent += '-- ============================================\n\n';

// Extract các SETVAL từ file dump
const setvalPattern = /SELECT pg_catalog\.setval\('public\.(\w+_id_seq)', (\d+), (true|false)\);/g;
let match;
const setvals = [];

while ((match = setvalPattern.exec(dumpContent)) !== null) {
  setvals.push({
    sequence: match[1],
    value: match[2],
    isMax: match[3] === 'true'
  });
}

// Sắp xếp và thêm SETVAL
const sortedSetvals = setvals.sort((a, b) => a.sequence.localeCompare(b.sequence));
for (const setval of sortedSetvals) {
  outputContent += `SELECT pg_catalog.setval('public.${setval.sequence}', ${setval.value}, ${setval.isMax});\n`;
}

// Ghi file output
fs.writeFileSync(outputFile, outputContent, 'utf8');

console.log(`✅ Successfully converted ${insertCount} COPY sections to INSERT statements`);
console.log(`✅ Added ${setvals.length} sequence SETVAL statements`);
console.log(`📝 Output file: ${outputFile}`);
console.log(`\n💡 Next steps:`);
console.log(`   1. Open DBeaver`);
console.log(`   2. Connect to your PostgreSQL database (sfb_db)`);
console.log(`   3. Open SQL Editor (Alt+Shift+E)`);
console.log(`   4. Open file: ${outputFile}`);
console.log(`   5. Execute SQL script (Ctrl+Enter)`);
