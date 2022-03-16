const express = require('express');
const res = require('express/lib/response');
const { animals } = require('./data/animals.json');
const fs = require('fs');
const path = require('path');
const { moveMessagePortToContext } = require('worker_threads');
// heroku apps get served on using port 80, and saves it in an environmental variable, process.env.PORT
// here we are using that port for heroku as default, then if not available we use 3001.
const PORT = process.env.PORT || 3001;
const app = express();

// parse incoming string or array data 
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data 
app.use(express.json());
// Middleware to instruct the server to make certain files available and not gate it behind a server endpoint
// provides a filepath to public folder and instructs server to make the files static resources
app.use(express.static('public'));

// filter by personality trait, diet, species, and name 
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        // Save personalityTraits as a dedicated array 
        // If personalityTraits is a string, place it into a new array and save. 
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        }
        else {
            personalityTraitsArray = query.personalityTraits;
        }
        // Loop through each trait in the personalityTraits array: 
        personalityTraitsArray.forEach(trait => {
            // Check the trait against each animal in the filteredResults array.
            // Remember,it is intially a copy of the animalsArray,
            // but here we're updating it for each trait in the .foreach() loop.
            // For each trait being targeted by the filter, the filteredResults
            // array will then contain only the entries that contain the trait,
            // so at the end we'll have an array of animals that have every one
            // of the traits when the .foreach() loop is finished. 
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {  
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

// find a single animal by ID 
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};
// intake new animal and push to fs containing the array of animals 
function createNewAnimal(body, animalsArray){
    const animal = body; 
    animalsArray.push(animal);
    // actually writes new data to the file
    fs.writeFileSync(
        // we want to write our animals.json file in the 'data' subdirectory, so we use path.join
        // __dirnam represents the directory of the file we excute the code in, 
        // with a path to the 'animals.json' file
        path.join(__dirname, './data/animals.json'),
        // we need to save the Javascript array data as JSON, so we stringify to convert it
        // null and 2 keep the data formatted: 
        // null = we dont want to edit any of our existing data; if we did we could pass something here
        // 2 indicates we want to create white space between our values to make it more readable. 
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // return finished code to post route for response 
    return animal;
};
// validate POST request data input to prevent err or malicious input
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true; 
};
// create route /api/animals
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
// create route to a single animal by ID
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if(result) {
        res.json(result);
    }
    else {
        res.sendStatus(404);
    }
});

// Creates route to server.js for the front end index.html 
// This will be the root/homepage of the server! 
// Note the GET request here doesnt return JSON, because it is only responding w/ HTML 
// So we use .sendFile instead of .json 
app.get('/', (req, res) => {
    // we use path module to be sure we are finding the correct location for HTML code to display, 
    // so it will work in any server environment
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Creates route to animals.html  
app.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, './public/animals.html'));
});

// Create route to zookeeprs.html 
app.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});

// Create error route to return home == always last as to not take precendence over the above routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


// Use POST request to save new animals on the server.
// Note the push to the createNewAnimal function, following validation 
app.post('/api/animals', (req, res) => {
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

// port where our server is hosted 
app.listen(PORT, ()=>{
    console.log(`API server now on port ${PORT}!`);
});

/* [#] Set up new front end. We’ll download code for the front end of the application the client 
    has provided us with and set it up in the project */ 
/* [#] Create routes to serve index.html. We'll create a route that serves the HTML file */
/* [#] Finish POST functionality. We need to finish some front-end code to handle 
    making a POST request to the server. */ 
/* [] Create routes to serve other pages. We have other HTML pages the client 
    wants to use for displaying data, so let’s create routes for them. */
/* [] Finish GET requests to serve page data. We need to finish the client-side 
    GET requests to handle getting the JSON data to display to users */


