-- VeloCity Supabase Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTH
-- ============================================

-- Profiles table (extends Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  phone TEXT UNIQUE,
  role TEXT CHECK (role IN ('driver', 'fleet_owner', 'station_worker', 'station_manager', 'municipality_admin', 'developer_admin', 'super_admin')) DEFAULT 'driver',
  association_code TEXT,
  is_active BOOLEAN DEFAULT true,
  subscription_paid BOOLEAN DEFAULT false,
  subscription_amount INTEGER DEFAULT 1000,
  subscription_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- VEHICLES
-- ============================================

CREATE TABLE public.vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plate TEXT UNIQUE NOT NULL,
  vehicle_type TEXT CHECK (vehicle_type IN ('bajaj', 'auto', 'truck')) NOT NULL,
  tank_capacity INTEGER NOT NULL,
  qr_code TEXT UNIQUE,
  owner_name TEXT,
  phone TEXT,
  photo_url TEXT,
  association_code TEXT,
  status TEXT DEFAULT 'active',
  wallet_balance INTEGER DEFAULT 5000,
  fill_count INTEGER DEFAULT 0,
  last_filled TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STATIONS
-- ============================================

CREATE TABLE public.stations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  municipality TEXT,
  address TEXT,
  phone TEXT,
  manager_id UUID REFERENCES public.profiles(id),
  fuel_received INTEGER DEFAULT 0,
  fuel_sold INTEGER DEFAULT 0,
  capacity INTEGER DEFAULT 10000,
  status TEXT DEFAULT 'active',
  availability TEXT DEFAULT 'FULL',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRANSACTIONS
-- ============================================

CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id),
  station_id UUID REFERENCES public.stations(id),
  worker_id UUID REFERENCES public.profiles(id),
  liters INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  price_per_liter INTEGER,
  currency TEXT DEFAULT 'ETB',
  status TEXT DEFAULT 'verified',
  driver_photo_url TEXT,
  pump_capture_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- APPOINTMENTS
-- ============================================

CREATE TABLE public.appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  driver_id UUID REFERENCES public.profiles(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  station_id UUID REFERENCES public.stations(id),
  scheduled_time TIMESTAMPTZ,
  batch_number INTEGER,
  position_in_batch INTEGER,
  status TEXT DEFAULT 'confirmed',
  notification_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVENUE TRACKING
-- ============================================

CREATE TABLE public.revenue_shares (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id),
  liters INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  developer_share INTEGER,
  ethiotelecom_share INTEGER,
  municipality_share INTEGER,
  station_share INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOGS
-- ============================================

CREATE TABLE public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  status TEXT DEFAULT 'pending',
  review_deadline TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENABLE RLS (Row Level Security)
-- ============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Vehicles: Owners can CRUD their vehicles
CREATE POLICY "Owners can CRUD vehicles" ON public.vehicles
  FOR ALL USING (auth.uid() = user_id);

-- Stations: Managers can manage their stations
CREATE POLICY "Managers can manage stations" ON public.stations
  FOR ALL USING (auth.uid() = manager_id);

-- Transactions: Anyone can read, only workers can create
CREATE POLICY "Anyone can read transactions" ON public.transactions
  FOR SELECT USING (true);

-- ============================================
-- EDGE FUNCTION: Revenue Split Calculator
-- ============================================

/*
After creating this schema in Supabase:
1. Go to → Edge Functions
2. Create new function: calculate_revenue_split
3. Paste the revenue calculation logic
*/

-- ============================================
-- SETUP TO GET STARTED:
-- ============================================
-- 
-- 1. Go to https://supabase.com → Create new project
-- 2. Run this SQL in the SQL Editor
-- 3. Copy your URL and Anon Key to Vercel env vars
-- 4. Deploy frontend to Vercel
--
-- Your Supabase will be live with:
-- ✓ Phone Authentication
-- ✓ Driver/Vehicle database
-- ✓ Transaction tracking
-- ✓ Revenue splitting