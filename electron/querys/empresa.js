const { Credenciales } = require('../utils/credenciales');

const tablasDatabase = async (database) => {
    const newPool = Credenciales(database);
    const query = `SELECT table_name, (select pg_size_pretty(pg_relation_size( CAST(table_name as text)))) as tamanio 
    FROM information_schema.tables WHERE table_schema=\'public\' AND table_type=\'BASE TABLE\' ORDER BY table_name`
    let respuesta = await newPool.query(query).then(result => { return result.rows });
    if (respuesta.length === 0) return respuesta
        
    return await Promise.all(respuesta.map(async(o) => {
        const queryTable = `SELECT count(*) FROM ${o.table_name}`
        o.registros = await newPool.query(queryTable).then(result => { return result.rows[0].count})
        return o
    }))
}

const informacionTabla = async (database, name_table) => {
    const newPool = Credenciales(database);
    const query = `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = \'${name_table}\' `
    return await newPool.query(query).then(result => { return result.rows; })
}

async function EmpresaInfo(newPool) {
    const query = `SELECT nombre, ruc, direccion, telefono, correo, representante, tipo_empresa FROM cg_empresa`
    try {
        const [result] = await newPool.query(query).then(result => { return result.rows; })
        if (result) return result
        return { error: "No hay registros en la tabla cg_empresa" }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

async function CountEmpleados(newPool) {
    try {
        const [ emp_activos ] = await newPool.query("SELECT CAST(count(*) AS int) FROM empleados WHERE estado = 1")
            .then(result => { return result.rows });
        const [ emp_inactivos ] = await newPool.query("SELECT CAST(count(*) AS int) FROM empleados WHERE estado = 2")
            .then(result => { return result.rows });

        return {
            activos: emp_activos.count,
            inactivos: emp_inactivos.count,
            total: emp_activos.count + emp_inactivos.count,
        }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

async function CountUsers(newPool) {
    try {
        const [ app_user_activos ] = await newPool.query("SELECT CAST(count(*) AS int) FROM usuarios WHERE app_habilita = true")
            .then(result => { return result.rows });
        const [ app_user_inactivos ] = await newPool.query("SELECT CAST(count(*) AS int) FROM usuarios WHERE app_habilita = false")
            .then(result => { return result.rows });

        return {
            activos: app_user_activos.count,
            inactivos: app_user_inactivos.count,
            total: app_user_activos.count + app_user_inactivos.count,
        }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

async function SucursalesInfo(newPool) {
    const query = `SELECT s.id, p.nombre AS provincia, c.descripcion AS ciudad, s.nombre AS sucursal
        FROM sucursales AS s, ciudades AS c, cg_provincias AS p
        WHERE s.id_ciudad = c.id AND c.id_provincia = p.id`
    try {
        const respuesta = await newPool.query(query)
            .then(result => { return result.rows });
        
        if (respuesta.length === 0) return respuesta
            
        return await Promise.all(respuesta.map(async(o) => {
            o.relojes = await newPool.query("SELECT id, numero_accion, nombre, ip, puerto, marca FROM cg_relojes WHERE id_sucursal = $1",[o.id])
                .then(result => { return result.rows })
            return o
        }))
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

const jsonDataEmpresa = async (database) => {
    const newPool = Credenciales(database);

    try {
        const dataEmpresa = await EmpresaInfo(newPool); 
        const empleados = await CountEmpleados(newPool);
        const usuarios = await CountUsers(newPool);
        const sucursales = await SucursalesInfo(newPool);
        return {
            empleados: empleados,
            usuarios: usuarios,
            empresa: dataEmpresa,
            sucursales: sucursales
        }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

const putlicenciaEmpresa = async (database, public_key) => {
    const newPool = Credenciales(database);
    try {
        const [result] = await newPool.query("UPDATE cg_empresa SET public_key = $1 RETURNING public_key",[public_key]).then(result => { return result.rows; })
        if (result) return result
        return { error: "No hay registros en la tabla cg_empresa" }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

module.exports = {
    tablasDatabase,
    informacionTabla,
    jsonDataEmpresa,
    putlicenciaEmpresa
}