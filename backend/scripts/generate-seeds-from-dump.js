const fs = require('fs');
const path = require('path');

// Đường dẫn file dump gốc và file output seed
const dumpFile = path.join(__dirname, '..', '..', 'dump-sfb_db-202601140944.sql');
const outputFile = path.join(__dirname, '..', 'database', 'seeds-from-dump.sql');

console.log('📦 Đang generate seed INSERT cho tất cả bảng từ file dump...');

if (!fs.existsSync(dumpFile)) {
  console.error(`❌ Không tìm thấy file dump: ${dumpFile}`);
  process.exit(1);
}

const dumpContent = fs.readFileSync(dumpFile, 'utf8');
const lines = dumpContent.split('\n');

// Escape string cho SQL
function escapeSqlString(str) {
  if (str === null || str === undefined || str === '\\N') {
    return 'NULL';
  }
  return `'${String(str).replace(/'/g, "''")}'`;
}

// Parse header COPY để lấy tên bảng + cột
function parseCopyHeader(header) {
  const match = header.match(/COPY public\.(\w+)\s*\(([^)]+)\)/);
  if (!match) return null;
  return {
    table: match[1],
    columns: match[2].split(',').map((c) => c.trim()),
  };
}

// Xác định kiểu cột đơn giản dựa trên tên
function detectColumnTypes(columns) {
  const numericColumns = new Set();
  const booleanColumns = new Set();
  const jsonbColumns = new Set();

  columns.forEach((col, idx) => {
    const name = col.toLowerCase();

    // id & *_id thường là số (foreign key)
    if (name === 'id' || name.endsWith('_id')) {
      numericColumns.add(idx);
    }

    // Các cột boolean phổ biến
    if (
      name.startsWith('is_') ||
      name === 'is_active' ||
      name === 'is_featured' ||
      name === 'is_default' ||
      name.includes('show_') ||
      name.includes('enable_') ||
      name.includes('highlight_')
    ) {
      booleanColumns.add(idx);
    }

    // Các cột JSONB
    if (
      name.includes('images') ||
      name === 'data' ||
      name.includes('features') ||
      name.includes('structured_data') ||
      name === 'slides' ||
      name === 'blocks' ||
      name === 'items'
    ) {
      jsonbColumns.add(idx);
    }
  });

  return { numericColumns, booleanColumns, jsonbColumns };
}

// Convert một COPY section thành block INSERT
function convertCopySection(section) {
  const headerInfo = parseCopyHeader(section.header);
  if (!headerInfo) {
    console.warn(`⚠️  Không parse được header: ${section.header}`);
    return '';
  }

  const { table, columns } = headerInfo;
  const { numericColumns, booleanColumns, jsonbColumns } = detectColumnTypes(columns);

  const dataLines = section.dataLines.filter((l) => {
    const t = l.trim();
    return t && t !== '\\.' && !t.startsWith('COPY public.');
  });

  if (dataLines.length === 0) {
    return `-- ${table}: không có dữ liệu trong dump\n\n`;
  }

  let out = '';
  out += '-- ============================================\n';
  out += `-- Seed data cho bảng: ${table} (từ dump-sfb_db-202601140944.sql)\n`;
  out += '-- ============================================\n';
  out += `INSERT INTO ${table} (${columns.join(', ')})\nVALUES\n`;

  const valueRows = [];

  for (const line of dataLines) {
    const parts = line.split('\t');
    if (parts.length !== columns.length) {
      console.warn(
        `⚠️  Bỏ qua 1 dòng của bảng ${table} vì số cột không khớp (có ${parts.length}, mong đợi ${columns.length})`
      );
      continue;
    }

    const converted = parts.map((raw, idx) => {
      const v = raw.trim();
      if (v === '\\N' || v === '') return 'NULL';

      // Số
      if (numericColumns.has(idx)) {
        const num = v.replace(/^['"]+|['"]+$/g, '').trim();
        if (/^\d+$/.test(num)) return num;
        return 'NULL';
      }

      // Boolean
      if (booleanColumns.has(idx)) {
        if (v === 't' || v.toLowerCase() === 'true') return 'TRUE';
        if (v === 'f' || v.toLowerCase() === 'false') return 'FALSE';
        return 'NULL';
      }

      // JSON/JSONB
      if (jsonbColumns.has(idx) || v.startsWith('{') || v.startsWith('[')) {
        return escapeSqlString(v) + '::jsonb';
      }

      // Chuỗi thường
      return escapeSqlString(v);
    });

    valueRows.push(`  (${converted.join(', ')})`);
  }

  if (valueRows.length === 0) {
    return `-- ${table}: không có dòng hợp lệ\n\n`;
  }

  out += valueRows.join(',\n') + ';\n\n';
  return out;
}

// Đọc tất cả COPY section trong dump
const copySections = [];
let inCopy = false;
let current = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.startsWith('COPY public.')) {
    inCopy = true;
    current = {
      header: line,
      dataLines: [],
    };
    continue;
  }

  if (inCopy) {
    current.dataLines.push(line);
    if (line.trim() === '\\.') {
      copySections.push(current);
      inCopy = false;
      current = null;
    }
  }
}

console.log(`✅ Tìm thấy ${copySections.length} COPY sections trong dump.`);

// Thứ tự bảng để tránh lỗi foreign key khi bạn chạy nguyên file
const orderedTables = [
  'roles',
  'users',
  'permissions',
  'role_permissions',
  'news_categories',
  'news',
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
  'site_settings',
];

// Sắp xếp COPY section theo thứ tự ưu tiên
const sortedSections = [];
for (const t of orderedTables) {
  const s = copySections.find((c) => c.header.includes(`COPY public.${t} `));
  if (s) sortedSections.push(s);
}
for (const s of copySections) {
  if (!sortedSections.includes(s)) sortedSections.push(s);
}

let output = '';
output += '-- ============================================\n';
output += '-- SEED DATA TỪ dump-sfb_db-202601140944.sql\n';
output += '-- File này chứa INSERT INTO ... VALUES ... cho TẤT CẢ các bảng có dữ liệu trong dump.\n';
output += '-- Bạn có thể:\n';
output += '--  - Import trực tiếp bằng DBeaver / psql sau khi chạy schema.sql\n';
output += '--  - Hoặc copy từng block vào ngay dưới CREATE TABLE tương ứng trong schema.sql\n';
output += '-- ============================================\n\n';

let sectionCount = 0;
for (const section of sortedSections) {
  const block = convertCopySection(section);
  if (block && block.trim()) {
    output += block;
    sectionCount++;
  }
}

// Thêm phần SETVAL cho sequence (để id auto-increment chạy tiếp đúng)
output += '-- ============================================\n';
output += '-- SET SEQUENCE VALUES (tùy chọn)\n';
output += '-- Nếu bạn muốn id tiếp tục tăng đúng sau khi seed, hãy chạy phần này sau cùng.\n';
output += '-- ============================================\n\n';

const setvalPattern =
  /SELECT pg_catalog\.setval\('public\.(\w+_id_seq)', (\d+), (true|false)\);/g;
let m;
const setvals = [];
while ((m = setvalPattern.exec(dumpContent)) !== null) {
  setvals.push({
    sequence: m[1],
    value: m[2],
    isMax: m[3] === 'true',
  });
}

setvals
  .sort((a, b) => a.sequence.localeCompare(b.sequence))
  .forEach((s) => {
    output += `SELECT pg_catalog.setval('public.${s.sequence}', ${s.value}, ${
      s.isMax ? 'true' : 'false'
    });\n`;
  });

fs.writeFileSync(outputFile, output, 'utf8');

console.log(`✅ Đã generate seed cho ${sectionCount} bảng.`);
console.log(`📝 File seed: ${outputFile}`);
console.log('\n💡 Gợi ý sử dụng:');
console.log('   - Sau khi tạo schema bằng npm run setup (hoặc chạy schema.sql),');
console.log('   - Import file seeds-from-dump.sql bằng DBeaver hoặc psql để nạp toàn bộ data thực tế.');

