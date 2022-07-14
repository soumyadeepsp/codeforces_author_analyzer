const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

router.get('/', homeController.home);
// router.get('/fetchData/:obj', homeController.fetchData);
router.get('/fetchData/:obj', homeController.fetchData);
router.get('/createDatabase', homeController.createDatabase);

module.exports = router;