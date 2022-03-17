const fs = require('fs');
const {
    filterByQuery,
    findById,
    createNewZookeeper,
    validateZookeeper
} = require('../lib/zookeeper');
const { zookeepers } = require('../data/zookeepers');

jest.mock('fs');

test('create zookeeper object', () => {
    const zookeeper = createNewZookeeper(
        { name: 'Zoolander', id: 'silverBullet'},
        zookeepers
    );

    expect(zookeeper.name).toBe('Zoolander');
    expect(zookeeper.id).toBe('silverBullet');
});

test('returns individual employee by id', () => {
    const startingKeepers = [
        {
            id: 'silverbullet',
            name: 'Zoolander',
            age: 22, 
            favoriteAnimal: 'cat'
        }, 
        {
            id: '22',
            name: 'Stan',
            age: 24, 
            favoriteAnimal: 'dog'
        }
    ];

    const result = findById('silverbullet', startingKeepers);
    expect(result.id).toBe('silverbullet');
});

test('filter by zookeeper query', () => {
    const startingKeepers = [
        {
            id: 'silverbullet',
            name: 'Zoolander',
            age: 22, 
            favoriteAnimal: 'cat'
        }, 
        {
            id: '22',
            name: 'Stan',
            age: 24, 
            favoriteAnimal: 'dog'
        }
    ];
    const filteredZookeepers = filterByQuery({ age: 22 }, startingKeepers);
    expect(filteredZookeepers.length).toEqual(1);
});

test('validates zookeeper input', () => {
    const keeper = {
        id: 'silverbullet',
        name: 'Zoolander',
        age: 22, 
        favoriteAnimal: 'cat'
    };
    const invalidKeeper = {
        id: 'silverbullet',
        name: 'Zoolander',
        age: 22, 
    };
    const result1 = validateZookeeper(keeper);
    const result2 = validateZookeeper(invalidKeeper);

    expect(result1).toBe(true);
    expect(result2).toBe(false);

})