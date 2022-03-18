const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');
const zookeeperRoutes = require('../apiRoutes/zookeeperRoutes');

// create middleware so that app knows about routes in animalRoutes.js
router.use(animalRoutes);

// create middleware to use zookeeperRoutes 
router.use(zookeeperRoutes);

module.exports = router; 