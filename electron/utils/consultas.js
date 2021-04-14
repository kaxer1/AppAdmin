const { pool } = require('./postgresql');
const Pool = require('pg-pool');
const fs = require('fs');

const listaBDD = async () => {
    const query = `select oid, datname, pg_size_pretty(pg_database_size(datname))
    from pg_database where datname not in (\'postgres\', \'template1\', \'template0\')
	order by pg_database_size(datname) desc`
    return await pool.query(query).then(result => {
        return result.rows;
    })
}

const usuariosDataBase = async () => {
    return await pool.query('select * from pg_user').then(result => {
        return result.rows;
    })
}

function Credenciales(database) {
    const credenciales = fs.readFileSync('bdd.conf.json','utf8');
    const [ obj ] = JSON.parse(credenciales)
    obj.database = database;
    return new Pool(obj)
}

const tablasDatabase = async(database) => {
    
    const newPool = Credenciales(database);
    const query = `SELECT table_name FROM information_schema.tables 
    WHERE table_schema=\'public\' AND table_type=\'BASE TABLE\' ORDER BY table_name`
    return await newPool.query(query).then(result => {
        return result.rows;
    })
}

const informacionTabla = async(database, name_table) => {
    
    const newPool = Credenciales(database);
    const query = `SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns WHERE table_name = \'${name_table}\' `
    return await newPool.query(query).then(result => {
        return result.rows;
    })
}


module.exports = {
    listaBDD,
    usuariosDataBase,
    tablasDatabase,
    informacionTabla
}