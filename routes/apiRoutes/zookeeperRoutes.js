const router = require('express').Router();
const { zookeepers } = require('../../data/zookeepers');
const {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper
} = require('../../lib/zookeeper');

// create route to zookeeper API 
router.get('/zookeepers', (req, res) => {
    let results = zookeepers;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

// create route to a single individual by ID 
router.get('/zookeepers/:id', (req, res) => {
    const result = findById(req.params.id, zookeepers);
    if (result) {
        res.json(result)
    }
    else {
        res.sendStatus(404); 
    }
});

// POST request to add new zookeepers 
router.post('/zookeepers', (req, res) => { 
    // sets id to the next index of the array
    req.body.id = zookeepers.length.toString();

    // if any data is incorrect, send 404
    if(!validateZookeeper(req.body)) {
        res.status(404).send('The zookeeper input is not properly formatted!')
    }
    else {
        // add zookeeper to JSON file and zookeepers array
        const zookeeper = createNewZookeeper(req.body, zookeepers);
        res.json(zookeeper);
    }
});

module.exports = router; 