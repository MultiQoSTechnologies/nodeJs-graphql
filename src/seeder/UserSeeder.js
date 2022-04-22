let userModel = require('../models/use.model');
module.exports = {
    run: () =>
        new Promise((resolve) => {
            (async () => {
                let user = [
                    {
                        id: 1,
                        name: 'Brian',
                        age: '21',
                        shark: 'Great White Shark'
                    },
                    {
                        id: 2,
                        name: 'Kim',
                        age: '22',
                        shark: 'Whale Shark'
                    },
                    {
                        id: 3,
                        name: 'Faith',
                        age: '23',
                        shark: 'Hammerhead Shark'
                    },
                    {
                        id: 4,
                        name: 'Joseph',
                        age: '23',
                        shark: 'Tiger Shark'
                    },
                    {
                        id: 5,
                        name: 'Joy',
                        age: '25',
                        shark: 'Hammerhead Shark'
                    }
                ];

                await userModel.insertMany(user);
                resolve(true);
            })();
        }),
};
