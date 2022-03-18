const fs = require('fs');
const path = require('path');

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
}

// intake new animal and push to fs containing the array of animals 
function createNewAnimal(body, animalsArray){
    const animal = body; 
    animalsArray.push(animal);
    // actually writes new data to the file
    fs.writeFileSync(
        // we want to write our animals.json file in the 'data' subdirectory, so we use path.join
        // __dirnam represents the directory of the file we excute the code in, 
        // with a path to the 'animals.json' file
        path.join(__dirname, '../data/animals.json'),
        // we need to save the Javascript array data as JSON, so we stringify to convert it
        // null and 2 keep the data formatted: 
        // null = we dont want to edit any of our existing data; if we did we could pass something here
        // 2 indicates we want to create white space between our values to make it more readable. 
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    // return finished code to post route for response 
    return animal;
}

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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal,
};