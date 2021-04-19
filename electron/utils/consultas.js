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

const getfuncionesModulos = async(database) => {
    
    const newPool = Credenciales(database);
    const query = `SELECT * FROM funciones`
    try {
        const [ result ] = await newPool.query(query).then(result => {
            return result.rows;
        })
    
        if (result) return result
        return { error: "No hay registros en la tabla funcionalidad" } 
        
    } catch (error) {
        console.log(error);
        return { err: error.toString() } 
    }
    
}

const putfuncionesModulos = async(database, data) => {
    
    const newPool = Credenciales(database);

    const { id, hora_extra, accion_personal, alimentacion, permisos } = data;
    // const query = ` = ${id}`
    try {
        const [ result ] = await newPool.query(
            "UPDATE funciones SET hora_extra = $2, accion_personal = $3, alimentacion = $4, permisos = $5 WHERE id = $1 RETURNING *", 
            [id, hora_extra, accion_personal, alimentacion, permisos]).then(result => {
            return result.rows;
        })
    
        if (result) return result
        return { error: "Erro en la actualizacion de funcionalidad" } 
        
    } catch (error) {
        console.log(error);
        return { err: error.toString() } 
    }
    
}

const getEmpresaInfo = async(database) => {
    
    const newPool = Credenciales(database);
    const query = `SELECT nombre, ruc, direccion, telefono, correo, representante, tipo_empresa FROM cg_empresa`
    try {
        const [ result ] = await newPool.query(query).then(result => {
            return result.rows;
        })
    
        if (result) return result
        return { error: "No hay registros en la tabla cg_empresa" } 
        
    } catch (error) {
        console.log(error);
        return { err: error.toString() } 
    }
    
}

const getUsersApp = async(database) => {
    
    const newPool = Credenciales(database);

    try {
        const result = await newPool.query("SELECT (e.nombre || \' \' || e.apellido) AS fullname, e.cedula, e.codigo, u.usuario, u.app_habilita, u.id as id_user " +
        "FROM empleados AS e, usuarios AS u WHERE CAST( e.codigo as int) = u.id_empleado").then(result => {
            return result.rows;
        })

        if (result.length === 0) return { error: "No hay registros en las tablas de empleado y usuario" }
        return result
        
    } catch (error) {
        console.log(error);
        return { err: error.toString() } 
    }
    
}


module.exports = {
    listaBDD,
    usuariosDataBase,
    tablasDatabase,
    informacionTabla,
    getfuncionesModulos,
    putfuncionesModulos,
    getEmpresaInfo,
    getUsersApp
}