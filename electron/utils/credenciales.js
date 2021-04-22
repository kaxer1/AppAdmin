const Pool = require('pg-pool');
const fs = require('fs');

function Credenciales(database) {
    const credenciales = fs.readFileSync('bdd.conf.json','utf8');
    const [ obj ] = JSON.parse(credenciales)
    obj.database = database;
    return new Pool(obj)
}

module.exports = {
    Credenciales
}