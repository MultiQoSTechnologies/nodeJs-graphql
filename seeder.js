require('./server');
require('./src/connection/db');
const seeder = require('./src/seeder/seeder');
const promises = [];
seeder.forEach((seed) => {
    promises.push(require(`./src/seeder/${seed}.js`).run());
});

Promise.all(promises)
.then(()=> {
    console.log('Seeder Completed');
},(err) => {
    console.log("Seeder error : ",err);
});