/** LawnCare Manager Pro v1.0 — Supabase Schema */
-- Run this in Supabase SQL Editor

-- ===== CUSTOMERS =====
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  service_frequency TEXT CHECK (service_frequency IN ('one_time','weekly','bi_weekly','monthly','seasonal')),
  service_type TEXT[],
  last_service_date DATE,
  next_service_date DATE,
  payment_status TEXT CHECK (payment_status IN ('paid','unpaid','past_due','refunded')) DEFAULT 'unpaid',
  notes TEXT,
  photos TEXT[],
  property_size TEXT,
  gate_code TEXT,
  preferred_day TEXT,
  customer_since DATE DEFAULT CURRENT_DATE,
  customer_type TEXT CHECK (customer_type IN ('residential','commercial')) DEFAULT 'residential',
  status TEXT CHECK (status IN ('active','inactive','new')) DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== SERVICES =====
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT,
  estimated_time TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== APPOINTMENTS =====
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  status TEXT CHECK (status IN ('requested','approved','scheduled','on_the_way','in_progress','completed','cancelled','rescheduled','payment_pending','paid')) DEFAULT 'requested',
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== ESTIMATES =====
CREATE TABLE IF NOT EXISTS estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  property_address TEXT,
  estimated_price DECIMAL(10,2),
  notes TEXT,
  photos TEXT[],
  status TEXT CHECK (status IN ('draft','sent','accepted','declined')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== TASKS =====
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  due_date DATE,
  priority TEXT CHECK (priority IN ('low','medium','high')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('not_started','in_progress','complete')) DEFAULT 'not_started',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== REMINDERS =====
CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  reminder_type TEXT CHECK (reminder_type IN ('appointment','payment','follow_up','equipment','recurring','seasonal')) DEFAULT 'appointment',
  due_date DATE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== PAYMENTS =====
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  stripe_session_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  payment_type TEXT CHECK (payment_type IN ('full','deposit','recurring')) DEFAULT 'full',
  status TEXT CHECK (status IN ('paid','unpaid','past_due','refunded')) DEFAULT 'unpaid',
  description TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== MESSAGES =====
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('inbound','outbound')) DEFAULT 'inbound',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== RBAC — Row Level Security =====
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Owners can only see their own data
CREATE POLICY "Owners see own customers" ON customers FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert own customers" ON customers FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own customers" ON customers FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own customers" ON customers FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Owners see own services" ON services FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert own services" ON services FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own services" ON services FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own services" ON services FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Owners see own appointments" ON appointments FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert own appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own appointments" ON appointments FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own appointments" ON appointments FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Owners see own estimates" ON estimates FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert own estimates" ON estimates FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own estimates" ON estimates FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own estimates" ON estimates FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Owners see own tasks" ON tasks FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own tasks" ON tasks FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own tasks" ON tasks FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Owners see own reminders" ON reminders FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert own reminders" ON reminders FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own reminders" ON reminders FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own reminders" ON reminders FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Owners see own payments" ON payments FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own payments" ON payments FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own payments" ON payments FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Owners see own messages" ON messages FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Owners insert own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners update own messages" ON messages FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners delete own messages" ON messages FOR DELETE USING (auth.uid() = owner_id);

-- ===== INDEXES =====
CREATE INDEX idx_customers_owner ON customers(owner_id);
CREATE INDEX idx_appointments_owner_date ON appointments(owner_id, date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_tasks_owner_date ON tasks(owner_id, due_date);
CREATE INDEX idx_reminders_owner_date ON reminders(owner_id, due_date);
CREATE INDEX idx_payments_owner ON payments(owner_id);
CREATE INDEX idx_estimates_status ON estimates(status);