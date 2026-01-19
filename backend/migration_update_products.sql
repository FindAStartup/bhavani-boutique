-- ==========================================
-- Migration: Update Products Table Schema
-- Run this in Supabase SQL Editor
-- ==========================================

-- Step 1: Drop existing products table if you want a fresh start
-- WARNING: This will delete all existing products!
-- Comment out if you want to keep existing data
DROP TABLE IF EXISTS public.product_stock CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;

-- Step 2: Create updated products table
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(10, 2) NOT NULL,
  category text CHECK (category IN ('Corset', 'Saree', 'Kurties', 'Set Mund', 'Bottoms')),
  images text[], -- Array of image URLs (4-5 images)
  material_care text, -- Care instructions
  sustainability_impact text, -- Sustainability information
  delivery_days int DEFAULT 7, -- Estimated delivery days
  is_draft boolean DEFAULT false, -- Draft status
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),;
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Step 3: Enable RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Step 4: Create policies for products
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Step 5: Create product_stock table
CREATE TABLE IF NOT EXISTS public.product_stock (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  size text NOT NULL,
  stock_quantity int DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE(product_id, size)
);

-- Step 6: Enable RLS for Product Stock
ALTER TABLE public.product_stock ENABLE ROW LEVEL SECURITY;

-- Step 7: Create policies for product_stock
CREATE POLICY "Public can view stock" ON product_stock
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage stock" ON product_stock
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ==========================================
-- Storage Policies (Run after creating bucket)
-- ==========================================

-- Policy 1: Allow anyone to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Policy 2: Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );

-- Policy 3: Allow admins to delete images
CREATE POLICY "Admins can delete"
ON storage.objects FOR DELETE
USING ( 
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ==========================================
-- Verification Queries
-- ==========================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('products', 'product_stock');

-- Check products table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'products'
ORDER BY ordinal_position;
