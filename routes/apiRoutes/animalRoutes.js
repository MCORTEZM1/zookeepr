const { filterByQuery, findById, createNewAnimal, validateAnimal} = require('../../lib/animals');
const { animals } = require('../../data/animals');
// cannot use 'app' in this file, since its in the server.js and shouldnt 
// be imported indefinitley so we must use Router()
const router = require('express').Router();

// create route /api/animals
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
// create route to a single animal by ID
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    }
    else {
        res.sendStatus(404);
    }
});
// Use POST request to save new animals on the server.
// Note the push to the createNewAnimal function, following validation 
router.post('/animals', (req, res) => {
    // req.body is where our incoming content will be
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 404 error back 
    if (!validateAnimal(req.body)) {
        // a response method to relay a message to the client making the request.
        res.status(404).send('The animal input is not properly formatted!');
    }
    else {
        // add animal to json file and animals array in this function 
        const animal = createNewAnimal(req.body, animals);
        res.json(animal); 
    }
});

module.exports = router;