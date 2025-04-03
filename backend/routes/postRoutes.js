const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// Rota para criar um novo post de marketing
router.post('/', postController.createPost);

module.exports = router;
