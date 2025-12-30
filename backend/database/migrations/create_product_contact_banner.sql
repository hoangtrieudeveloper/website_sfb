-- Tạo bảng product_contact_banner
CREATE TABLE IF NOT EXISTS product_contact_banner (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  primary_cta_text VARCHAR(255),
  primary_cta_link VARCHAR(255),
  secondary_cta_text VARCHAR(255),
  secondary_cta_link VARCHAR(255),
  background_gradient VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_contact_banner_active ON product_contact_banner(is_active);

-- Trigger cập nhật updated_at
DROP TRIGGER IF EXISTS update_product_contact_banner_updated_at ON product_contact_banner;
CREATE TRIGGER update_product_contact_banner_updated_at
    BEFORE UPDATE ON product_contact_banner
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

