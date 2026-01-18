const express = require('express');
const router = express.Router();
const { getUserRole } = require('../controllers/authController');

router.post('/get-user-role', getUserRole);

module.exports = router;
