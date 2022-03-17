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