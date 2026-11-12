-- ====================================================================
-- NAKSHATRA MOTORS — SUPABASE POSTGRESQL DATABASE SCHEMA & MIGRATIONS
-- Authorized Hestur Energy Electric Scooter Dealer
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SCOOTER MODELS TABLE
CREATE TABLE IF NOT EXISTS public.scooters (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  series TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  price NUMERIC NOT NULL,
  certified_range INTEGER NOT NULL,
  top_speed INTEGER NOT NULL,
  battery_capacity TEXT NOT NULL,
  charging_time TEXT NOT NULL,
  battery_chemistry TEXT NOT NULL,
  motor_power TEXT NOT NULL,
  torque TEXT,
  acceleration TEXT,
  brakes TEXT,
  suspension TEXT,
  curb_weight TEXT,
  boot_space TEXT,
  warranty_vehicle TEXT,
  warranty_battery TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  image TEXT NOT NULL,
  gallery JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CUSTOMER ENQUIRIES & TEST RIDE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT,
  scooter_model TEXT NOT NULL,
  enquiry_type TEXT NOT NULL,
  message TEXT,
  preferred_date DATE,
  status TEXT DEFAULT 'New',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VERIFIED CUSTOMER TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  scooter_model TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  date TEXT NOT NULL,
  verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. FREQUENTLY ASKED QUESTIONS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SITE SETTINGS & CONFIGURATION TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  dealer_name TEXT NOT NULL,
  brand_affiliation TEXT NOT NULL,
  hero_headline TEXT NOT NULL,
  hero_supporting_text TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp_number TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  operating_hours TEXT NOT NULL,
  happy_customers_count INTEGER DEFAULT 100,
  showroom_location_url TEXT,
  battery_chemistry_highlight TEXT,
  battery_warranty_highlight TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.scooters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES

-- Public can READ scooters, testimonials, faqs, and site_settings
CREATE POLICY "Allow public read access to scooters" ON public.scooters FOR SELECT USING (true);
CREATE POLICY "Allow public read access to testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Allow public read access to faqs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Allow public read access to site_settings" ON public.site_settings FOR SELECT USING (true);

-- Public can INSERT enquiries (test ride and contact leads)
CREATE POLICY "Allow public to submit enquiries" ON public.enquiries FOR INSERT WITH CHECK (true);

-- Authenticated admins can manage all data
CREATE POLICY "Allow authenticated admin full access to scooters" ON public.scooters FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated admin full access to enquiries" ON public.enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated admin full access to testimonials" ON public.testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated admin full access to faqs" ON public.faqs FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow authenticated admin full access to site_settings" ON public.site_settings FOR ALL TO authenticated USING (true);

-- 9. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_scooters_slug ON public.scooters (slug);
CREATE INDEX IF NOT EXISTS idx_scooters_display_order ON public.scooters (display_order);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON public.enquiries (status);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_display_order ON public.faqs (display_order);
