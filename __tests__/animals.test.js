const fs = require('fs');
const {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
} = require('../lib/animals');
const { animals } = require('../data/animals');

// so CreateNewAnimal doesnt write to animal database, use mock
jest.mock('fs');


test('creates an animal object', () => {
    const animal = createNewAnimal(
        { name: 'Darlene', id: '123123' },
        animals
    );
    
    expect(animal.name).toBe('Darlene');
    expect(animal.id).toBe('123123');
});

test('Returns single animal based on id', () => {
    const startingAnimals = [
        {
            id: '3',
            name: 'Erica',
            species: 'gorilla',
            diet: 'omnivore',
            personalityTraits: ['quirky', 'rash']
        },
        {
            id: '4',
            name: 'Noel',
            species: 'bear',
            diet: 'carnivore',
            personalityTraits: ['impish', 'sassy', 'brave']
        },
    ];
    const result = findById("3", startingAnimals);
    const result2 = findById("4", startingAnimals);

    expect(result.name).toBe('Erica');
    expect(result2.diet).toBe('carnivore');
});

test('filters by query', () => {
    const startingAnimals = [
        {
            id: '3',
            name: 'Erica',
            species: 'gorilla',
            diet: 'omnivore',
            personalityTraits: ['quirky', 'rash']
        },
        {
            id: '4',
            name: 'Noel',
            species: 'bear',
            diet: 'carnivore',
            personalityTraits: ['impish', 'sassy', 'brave']
        },
    ];
    const filteredAnimals = filterByQuery({ species: 'gorilla'}, startingAnimals)
    
    expect(filteredAnimals.length).toEqual(1);
});

test('validates personality traits', () => {
    const animal = {
        id: '3',
        name: 'Erica',
        species: 'gorilla',
        diet: 'omnivore',
        personalityTraits: ['quirky', 'rash']
    };

    const invalidAnimal = {
        id: '3',
        name: 'Erica',
        species: 'gorilla',
        diet: 'omnivore',
    };
    const result = validateAnimal(animal);
    const result2 = validateAnimal(invalidAnimal);
    
    expect(result).toBe(true);
    expect(result2).toEqual(false);
});