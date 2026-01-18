# Supabase Storage Setup Instructions

## Step 1: Create Storage Bucket

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **Storage** in the left sidebar
4. Click **New Bucket**
5. Configure the bucket:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Enable (so images are publicly accessible)
   - **File size limit**: 5MB (optional)
   - **Allowed MIME types**: `image/*` (optional)
6. Click **Create Bucket**

## Step 2: Set Storage Policies

After creating the bucket, set up the following policies:

### Policy 1: Public Read Access
```sql
-- Allow anyone to read images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'product-images' );
```

### Policy 2: Authenticated Upload
```sql
-- Allow authenticated users to upload
create policy "Authenticated users can upload"
on storage.objects for insert
with check ( bucket_id = 'product-images' AND auth.role() = 'authenticated' );
```

### Policy 3: Admin Delete
```sql
-- Allow admins to delete images
create policy "Admins can delete"
on storage.objects for delete
using ( 
  bucket_id = 'product-images' 
  AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

## Step 3: Update Environment Variables

Make sure your `.env` file in the backend has:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Step 4: Test Image Upload

1. Navigate to `/admin/add-product`
2. Upload an image
3. Check the Supabase Storage dashboard to verify the upload

## Troubleshooting

- **403 Forbidden**: Check storage policies are correctly set
- **Upload fails**: Verify SUPABASE_SERVICE_ROLE_KEY is correct
- **Images not displaying**: Ensure bucket is set to public
