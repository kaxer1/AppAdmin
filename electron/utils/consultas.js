const { pool } = require('./postgresql');

const { 
    tablasDatabase,
    informacionTabla,
    jsonDataEmpresa,
    putlicenciaEmpresa
} = require('../querys/empresa');

const {
    getfuncionesModulos,
    putfuncionesModulos,
    getAccessWebEmploy,
    putAccessWebEmploy
} = require('../querys/modulos');

const {
    getUsersApp,
    putUserApp
} = require('../querys/reloj_virtual');

const {
    getLicencias,
    createLicencia,
    obtenerLicencia
} = require('../querys/licencias');

const {
    fileUpload
} = require('../querys/uploads');

const listaBDD = async () => {
    const query = `select oid, datname, pg_size_pretty(pg_database_size(datname))
    from pg_database where datname not in (\'postgres\', \'template1\', \'template0\', \'licencias\')
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
    jsonDataEmpresa,
    getUsersApp,
    putUserApp,
    getLicencias,
    obtenerLicencia,
    createLicencia,
    putlicenciaEmpresa,
    getAccessWebEmploy,
    putAccessWebEmploy,
    fileUpload
}