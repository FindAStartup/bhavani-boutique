const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const cartController = {
    // Get user's cart
    getCart: async (req, res) => {
        try {
            const userId = req.user.id;

            const { data: cartItems, error } = await supabase
                .from('cart_items')
                .select(`
          *,
          product:products (
            id,
            name,
            price,
            images,
            category,
            product_stock
          )
        `)
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            res.json({ cart: cartItems });
        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ error: 'Failed to fetch cart' });
        }
    },

    // Add item to cart
    addToCart: async (req, res) => {
        try {
            const userId = req.user.id;
            const { product_id, size, quantity = 1 } = req.body;

            if (!product_id || !size) {
                return res.status(400).json({ error: 'Product ID and size are required' });
            }

            // Check if item already exists in cart
            const { data: existingItem, error: fetchError } = await supabase
                .from('cart_items')
                .select('*')
                .eq('user_id', userId)
                .eq('product_id', product_id)
                .eq('size', size)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows found"
                throw fetchError;
            }

            let result;

            if (existingItem) {
                // Update quantity if item exists
                const { data, error } = await supabase
                    .from('cart_items')
                    .update({ quantity: existingItem.quantity + quantity })
                    .eq('id', existingItem.id)
                    .select()
                    .single();

                if (error) throw error;
                result = data;
            } else {
                // Insert new item
                const { data, error } = await supabase
                    .from('cart_items')
                    .insert([{ user_id: userId, product_id, size, quantity }])
                    .select()
                    .single(); // Ensure we get the inserted row back

                if (error) throw error;
                result = data;
            }

            res.status(200).json({ message: 'Item added to cart', item: result });
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ error: 'Failed to add item to cart' });
        }
    },

    // Update cart item quantity
    updateCartItem: async (req, res) => {
        try {
            const userId = req.user.id;
            const { id } = req.params;
            const { quantity } = req.body;

            if (quantity < 1) {
                return res.status(400).json({ error: 'Quantity must be at least 1' });
            }

            const { data, error } = await supabase
                .from('cart_items')
                .update({ quantity })
                .eq('id', id)
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;

            res.json({ message: 'Cart updated', item: data });
        } catch (error) {
            console.error('Error updating cart:', error);
            res.status(500).json({ error: 'Failed to update cart' });
        }
    },

    // Remove item from cart
    removeFromCart: async (req, res) => {
        try {
            const userId = req.user.id;
            const { id } = req.params;

            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;

            res.json({ message: 'Item removed from cart' });
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).json({ error: 'Failed to remove item from cart' });
        }
    }
};

module.exports = cartController;
