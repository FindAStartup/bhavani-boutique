const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Get user's wishlist with product details
 * @route GET /api/wishlist
 * @access Private (requires authentication)
 */
const getUserWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Fetch wishlist items with full product details
        const { data: wishlistItems, error } = await supabase
            .from('wishlists')
            .select(`
                id,
                created_at,
                product_id,
                products (
                    id,
                    name,
                    description,
                    price,
                    category,
                    images,
                    material_care,
                    sustainability_impact,
                    delivery_days,
                    created_at,
                    product_stock (
                        size,
                        stock_quantity
                    )
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Get wishlist error:', error);
            return res.status(500).json({ error: error.message });
        }

        // Transform the data to flatten product details
        const formattedWishlist = wishlistItems.map(item => ({
            wishlist_id: item.id,
            added_at: item.created_at,
            ...item.products
        }));

        res.json({
            wishlist: formattedWishlist,
            count: formattedWishlist.length
        });
    } catch (error) {
        console.error('Get user wishlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Add product to user's wishlist
 * @route POST /api/wishlist
 * @access Private (requires authentication)
 */
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { product_id } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (!product_id) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        // Check if product exists
        const { data: product, error: productError } = await supabase
            .from('products')
            .select('id')
            .eq('id', product_id)
            .single();

        if (productError || !product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Add to wishlist (unique constraint will prevent duplicates)
        const { data: wishlistItem, error } = await supabase
            .from('wishlists')
            .insert([{
                user_id: userId,
                product_id: product_id
            }])
            .select()
            .single();

        if (error) {
            // Check if it's a duplicate entry error
            if (error.code === '23505') {
                return res.status(409).json({ error: 'Product already in wishlist' });
            }
            console.error('Add to wishlist error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.status(201).json({
            message: 'Product added to wishlist',
            wishlist_item: wishlistItem
        });
    } catch (error) {
        console.error('Add to wishlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Remove product from user's wishlist
 * @route DELETE /api/wishlist/:productId
 * @access Private (requires authentication)
 */
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) {
            console.error('Remove from wishlist error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json({ message: 'Product removed from wishlist' });
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * Check if a product is in user's wishlist
 * @route GET /api/wishlist/check/:productId
 * @access Private (requires authentication)
 */
const checkWishlistStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;

        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { data, error } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Check wishlist status error:', error);
            return res.status(500).json({ error: error.message });
        }

        res.json({ in_wishlist: !!data });
    } catch (error) {
        console.error('Check wishlist status error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus
};
