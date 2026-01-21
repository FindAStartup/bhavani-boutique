-- Run this entire block in the Supabase SQL Editor

-- 1. First, drop the existing constraint so we can modify the data freely
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_category_check;

-- 2. Update the data: Change 'Corset' to 'Cordset'
UPDATE products 
SET category = 'Cordset' 
WHERE category = 'Corset';

-- 3. Now add the new constraint with 'Cordset' instead of 'Corset'
ALTER TABLE products 
ADD CONSTRAINT products_category_check 
CHECK (category IN ('Cordset', 'Saree', 'Kurties', 'Set Mund', 'Bottoms'));

-- 4. Verify the changes
SELECT category, count(*) 
FROM products 
GROUP BY category;
