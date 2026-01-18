const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create a new product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            images,
            material_care,
            sustainability_impact,
            delivery_days,
            is_draft,
            stock // Array of { size, quantity }
        } = req.body;

        // Validate required fields
        if (!name || !price || !category) {
            return res.status(400).json({ error: 'Name, price, and category are required' });
        }

        // Validate images (4-5 required)
        if (!is_draft && (!images || images.length < 4 || images.length > 5)) {
            return res.status(400).json({ error: 'Please upload 4-5 product images' });
        }

        // Insert product
        const { data: product, error: productError } = await supabase
            .from('products')
            .insert([{
                name,
                description,
                price,
                category,
                images,
                material_care,
                sustainability_impact,
                delivery_days: delivery_days || 7,
                is_draft: is_draft || false
            }])
            .select()
            .single();

        if (productError) {
            console.error('Product creation error:', productError);
            return res.status(500).json({ error: productError.message });
        }

        // Insert stock for each size
        if (stock && stock.length > 0) {
            const stockEntries = stock.map(item => ({
                product_id: product.id,
                size: item.size,
                stock_quantity: item.quantity || 0
            }));

            const { error: stockError } = await supabase
                .from('product_stock')
                .insert(stockEntries);

            if (stockError) {
                console.error('Stock creation error:', stockError);
                // Rollback product creation
                await supabase.from('products').delete().eq('id', product.id);
                return res.status(500).json({ error: 'Failed to create product stock' });
            }
        }

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all products
const getAllProducts = async (req, res) => {
    try {
        const { category, is_draft } = req.query;

        let query = supabase
            .from('products')
            .select(`
        *,
        product_stock (
          size,
          stock_quantity
        )
      `)
            .order('created_at', { ascending: false });

        // Filter by category if provided
        if (category) {
            query = query.eq('category', category);
        }

        // Filter drafts (default: show only published)
        if (is_draft !== undefined) {
            query = query.eq('is_draft', is_draft === 'true');
        } else {
            query = query.eq('is_draft', false);
        }

        const { data: products, error } = await query;

        if (error) {
            console.error('Get products error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json({ products });
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get single product by ID
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const { data: product, error } = await supabase
            .from('products')
            .select(`
        *,
        product_stock (
          size,
          stock_quantity
        )
      `)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Get product error:', error);
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Get product by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            price,
            category,
            images,
            material_care,
            sustainability_impact,
            delivery_days,
            is_draft,
            stock
        } = req.body;

        // Update product
        const { data: product, error: productError } = await supabase
            .from('products')
            .update({
                name,
                description,
                price,
                category,
                images,
                material_care,
                sustainability_impact,
                delivery_days,
                is_draft,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (productError) {
            console.error('Update product error:', productError);
            return res.status(500).json({ error: productError.message });
        }

        // Update stock if provided
        if (stock && stock.length > 0) {
            // Delete existing stock
            await supabase.from('product_stock').delete().eq('product_id', id);

            // Insert new stock
            const stockEntries = stock.map(item => ({
                product_id: id,
                size: item.size,
                stock_quantity: item.quantity || 0
            }));

            const { error: stockError } = await supabase
                .from('product_stock')
                .insert(stockEntries);

            if (stockError) {
                console.error('Stock update error:', stockError);
                return res.status(500).json({ error: 'Failed to update product stock' });
            }
        }

        res.json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Delete product error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Upload image to Supabase Storage
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const file = req.file;
        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = `products/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('product-images')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (error) {
            console.error('Upload error:', error);
            return res.status(500).json({ error: error.message });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);

        res.json({
            message: 'Image uploaded successfully',
            url: publicUrl
        });
    } catch (error) {
        console.error('Upload image error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadImage
};
