const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/', awaitHandlerFactory(userController.getAllUsers)); // localhost:3000/api/v1/users


module.exports = router;