const router = require('express').Router();
const animalRoutes = require('../apiRoutes/animalRoutes');

// create middleware so that app knows about routes in animalRoutes.js
router.use(animalRoutes);

module.exports = router; 