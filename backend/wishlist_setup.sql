-- ==========================================
-- Wishlist Table Setup
-- ==========================================
-- This table stores user wishlist items
-- Each user can have multiple products in their wishlist
-- Duplicate entries are prevented by unique constraint

-- 1. Create wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, product_id) -- Prevent duplicate wishlist entries
);

-- 2. Enable Row Level Security
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Users can only view their own wishlist items
CREATE POLICY "Users can view own wishlist" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only add to their own wishlist
CREATE POLICY "Users can add to own wishlist" ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only remove from their own wishlist
CREATE POLICY "Users can remove from own wishlist" ON wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- 4. Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product_id ON public.wishlists(product_id);

-- ==========================================
-- Instructions:
-- ==========================================
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to SQL Editor
-- 3. Copy and paste this entire SQL script
-- 4. Click "Run" to execute
-- 5. Verify the table was created in the Table Editor
