const express = require('express');
const router = express.Router();
const {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus
} = require('../controllers/wishlistController');

const { authenticateUser } = require('../middleware/authMiddleware');

// All wishlist routes require authentication
router.use(authenticateUser);

// Wishlist routes
router.get('/', getUserWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);
router.get('/check/:productId', checkWishlistStatus);

module.exports = router;
