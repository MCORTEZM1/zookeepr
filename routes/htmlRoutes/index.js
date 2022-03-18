const path = require('path');
const router = require('express').Router();

// Creates route to server.js for the front end index.html 
// This will be the root/homepage of the server! 
// Note the GET request here doesnt return JSON, because it is only responding w/ HTML 
// So we use .sendFile instead of .json 
router.get('/', (req, res) => {
    // we use path module to be sure we are finding the correct location for HTML code to display, 
    // so it will work in any server environment
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Creates route to animals.html  
router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

// Create route to zookeeprs.html 
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

// Create error route to return home == always last as to not take precendence over the above routes
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

module.exports = router; 