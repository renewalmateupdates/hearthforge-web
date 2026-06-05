-- ============================================================
-- HEARTHFORGE DATABASE SCHEMA
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage all profiles" ON profiles FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    CASE WHEN NEW.email = current_setting('app.admin_email', true) THEN 'admin' ELSE 'editor' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- SITE SETTINGS (key-value store for global config)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  value_json JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage settings" ON site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- MEDIA LIBRARY
-- ============================================================
CREATE TABLE IF NOT EXISTS media_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  caption TEXT,
  folder TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view media" ON media_items FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage media" ON media_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- NAVIGATION MENUS
-- ============================================================
CREATE TABLE IF NOT EXISTS navigation_menus (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  items JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE navigation_menus ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read menus" ON navigation_menus FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage menus" ON navigation_menus FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- HOMEPAGE SECTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  button_text TEXT,
  button_url TEXT,
  button_secondary_text TEXT,
  button_secondary_url TEXT,
  image_url TEXT,
  background_url TEXT,
  items JSONB DEFAULT '[]',
  enabled BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read homepage" ON homepage_sections FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage homepage" ON homepage_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- PRODUCTS / SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(10,2),
  price_label TEXT,
  image_url TEXT,
  gallery JSONB DEFAULT '[]',
  category TEXT,
  tags TEXT[],
  features JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view available products" ON products FOR SELECT USING (is_available = true);
CREATE POLICY "Admins/editors can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- PORTFOLIO / GALLERY
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  gallery JSONB DEFAULT '[]',
  category TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view portfolio" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage portfolio" ON portfolio_items FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- ABOUT PAGE
-- ============================================================
CREATE TABLE IF NOT EXISTS about_sections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  image_url TEXT,
  items JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE about_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read about" ON about_sections FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage about" ON about_sections FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- TESTIMONIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_title TEXT,
  customer_photo TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published testimonials" ON testimonials FOR SELECT USING (is_published = true);
CREATE POLICY "Admins/editors can manage testimonials" ON testimonials FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- FAQS
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published faqs" ON faqs FOR SELECT USING (is_published = true);
CREATE POLICY "Admins/editors can manage faqs" ON faqs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- BLOG
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  featured_image TEXT,
  category_id UUID REFERENCES blog_categories(id),
  author_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view blog categories" ON blog_categories FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage categories" ON blog_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published posts" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Admins/editors can manage posts" ON blog_posts FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- CONTACT FORM SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact form" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins/editors can read submissions" ON contact_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);
CREATE POLICY "Admins/editors can update submissions" ON contact_submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- SEO SETTINGS (per-page)
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_path TEXT UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  robots TEXT DEFAULT 'index, follow',
  canonical_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read seo" ON seo_settings FOR SELECT USING (true);
CREATE POLICY "Admins/editors can manage seo" ON seo_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'editor'))
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
  ('business_name', 'Hearthforge'),
  ('tagline', 'Precision Craft. Forged for Creators.'),
  ('contact_email', 'hearthforge.hq@gmail.com'),
  ('contact_phone', ''),
  ('address', ''),
  ('facebook_url', ''),
  ('instagram_url', ''),
  ('twitter_url', ''),
  ('tiktok_url', ''),
  ('youtube_url', ''),
  ('footer_text', '© 2026 Hearthforge. All rights reserved.'),
  ('google_analytics_id', '')
ON CONFLICT (key) DO NOTHING;

-- Default navigation
INSERT INTO navigation_menus (name, slug, items) VALUES
  ('Main Navigation', 'main', '[
    {"id":"1","label":"Home","url":"/","order":0},
    {"id":"2","label":"Products","url":"/products","order":1},
    {"id":"3","label":"Portfolio","url":"/portfolio","order":2},
    {"id":"4","label":"About","url":"/about","order":3},
    {"id":"5","label":"Blog","url":"/blog","order":4},
    {"id":"6","label":"Contact","url":"/contact","order":5}
  ]'),
  ('Footer Links', 'footer', '[
    {"id":"1","label":"Privacy Policy","url":"/privacy","order":0},
    {"id":"2","label":"Terms of Service","url":"/terms","order":1},
    {"id":"3","label":"FAQ","url":"/faq","order":2}
  ]')
ON CONFLICT (slug) DO NOTHING;

-- Default homepage sections
INSERT INTO homepage_sections (section_key, title, subtitle, content, button_text, button_url, button_secondary_text, button_secondary_url, enabled, sort_order) VALUES
  ('hero', 'Forged for Creators', 'Precision 3D-printed desk accessories built for streamers, gamers, and content creators.', '', 'Shop Products', '/products', 'View Portfolio', '/portfolio', true, 0),
  ('features', 'Why Hearthforge?', 'Every piece is designed with purpose and printed with precision.', '', '', '', '', '', true, 1),
  ('featured_products', 'Our Products', 'Modular, minimal, and built to last.', '', 'See All Products', '/products', '', '', true, 2),
  ('cta', 'Ready to upgrade your setup?', 'Get early access to our modular desk rail system.', '', 'Get Early Access', '/contact', '', '', true, 3)
ON CONFLICT (section_key) DO NOTHING;

-- Default about sections
INSERT INTO about_sections (section_key, title, content) VALUES
  ('story', 'Our Story', 'Hearthforge was born from a shared passion for clean setups and precision craftsmanship. Founded by Butch and Joshua, we build modular 3D-printed accessories designed specifically for creators.'),
  ('mission', 'Our Mission', 'To give creators the tools to build their perfect workspace — one precision-crafted piece at a time.'),
  ('team', 'The Team', '')
ON CONFLICT (section_key) DO NOTHING;

-- Default FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
  ('What materials do you use?', 'We print using high-quality PLA and PETG filaments on professional-grade printers for durability and precision.', 'Products', 0),
  ('Do you offer custom sizes?', 'Yes! Contact us with your desk dimensions and we can create custom lengths and configurations.', 'Products', 1),
  ('How long does shipping take?', 'Most orders ship within 3-5 business days. Custom orders may take 7-10 business days.', 'Shipping', 2),
  ('Do you sell STL files?', 'Yes, we offer digital STL files for those who prefer to print at home. Check our products page for available files.', 'Products', 3),
  ('What is your return policy?', 'We stand behind our products. If you are not satisfied, contact us within 30 days of delivery.', 'Orders', 4)
ON CONFLICT DO NOTHING;

-- Default blog category
INSERT INTO blog_categories (name, slug, description) VALUES
  ('Build Updates', 'build-updates', 'Progress updates and behind-the-scenes from the workshop'),
  ('Setup Tips', 'setup-tips', 'Tips for building your perfect creator setup'),
  ('Products', 'products', 'Product announcements and spotlights')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- STORAGE BUCKETS (run after creating buckets in Supabase dashboard)
-- ============================================================
-- Create these buckets in Supabase Storage:
--   1. "media"     - public bucket for all site media
--   2. "avatars"   - public bucket for profile photos

-- Storage policies (run after creating buckets):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;

CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'media' AND auth.role() = 'authenticated'
);
CREATE POLICY "Authenticated users can update media" ON storage.objects FOR UPDATE USING (
  bucket_id = 'media' AND auth.role() = 'authenticated'
);
CREATE POLICY "Authenticated users can delete media" ON storage.objects FOR DELETE USING (
  bucket_id = 'media' AND auth.role() = 'authenticated'
);
