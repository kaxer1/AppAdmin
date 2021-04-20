const { pool } = require('./postgresql');

const { 
    tablasDatabase,
    informacionTabla,
    getfuncionesModulos,
    putfuncionesModulos,
    getEmpresaInfo,
    jsonDataEmpresa,
    getUsersApp 
} = require('../querys/empresa');

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



module.exports = {
    listaBDD,
    usuariosDataBase,
    tablasDatabase,
    informacionTabla,
    getfuncionesModulos,
    putfuncionesModulos,
    getEmpresaInfo,
    jsonDataEmpresa,
    getUsersApp
}