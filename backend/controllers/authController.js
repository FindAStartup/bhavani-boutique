const supabase = require('../config/supabaseClient');

// @desc    Get user role
// @route   POST /api/auth/get-user-role
// @access  Public (Called by Frontend after Auth)
const getUserRole = async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        // Query the 'profiles' table to get the role
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return res.status(500).json({ error: 'Failed to fetch user role' });
        }

        if (!data) {
            return res.status(404).json({ error: 'User profile not found' });
        }

        res.json({ role: data.role });

    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getUserRole,
};
