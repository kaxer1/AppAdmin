const { Credenciales } = require('../utils/credenciales');

const tablasDatabase = async (database) => {
    const newPool = Credenciales(database);
    const query = `SELECT table_name FROM information_schema.tables WHERE table_schema=\'public\' AND table_type=\'BASE TABLE\' ORDER BY table_name`
    return await newPool.query(query).then(result => { return result.rows; })
}

const informacionTabla = async (database, name_table) => {
    const newPool = Credenciales(database);
    const query = `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = \'${name_table}\' `
    return await newPool.query(query).then(result => { return result.rows; })
}

const getfuncionesModulos = async (database) => {
    const newPool = Credenciales(database);
    try {
        const [result] = await newPool.query("SELECT * FROM funciones").then(result => { return result.rows; })
        if (result) return result
        return { error: "No hay registros en la tabla funcionalidad" }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

const putfuncionesModulos = async (database, data) => {
    const newPool = Credenciales(database);
    const { id, hora_extra, accion_personal, alimentacion, permisos } = data;
    try {
        const [result] = await newPool.query(
            "UPDATE funciones SET hora_extra = $2, accion_personal = $3, alimentacion = $4, permisos = $5 WHERE id = $1 RETURNING *",
            [id, hora_extra, accion_personal, alimentacion, permisos])
            .then(result => { return result.rows; })

        if (result) return result
        return { error: "Erro en la actualizacion de funcionalidad" }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

async function getEmpresaInfo(database) {
    const newPool = Credenciales(database);
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

const jsonDataEmpresa = async (database) => {
    const newPool = Credenciales(database);

    try {

        const dataEmpresa = await getEmpresaInfo(database); 

        const [ emp_activos ] = await newPool.query("SELECT CAST(count(*) AS int) FROM empleados WHERE estado = 1")
            .then(result => { return result.rows });
        const [ emp_inactivos ] = await newPool.query("SELECT CAST(count(*) AS int) FROM empleados WHERE estado = 2")
            .then(result => { return result.rows });

        const empleados = {
            activos: emp_activos.count,
            inactivos: emp_inactivos.count,
            total: emp_activos.count + emp_inactivos.count,
        }

        const [ app_user_activos ] = await newPool.query("SELECT CAST(count(*) AS int) FROM usuarios WHERE app_habilita = true")
            .then(result => { return result.rows });
        const [ app_user_inactivos ] = await newPool.query("SELECT CAST(count(*) AS int) FROM usuarios WHERE app_habilita = false")
            .then(result => { return result.rows });

        const usuarios = {
            activos: app_user_activos.count,
            inactivos: app_user_inactivos.count,
            total: app_user_activos.count + app_user_inactivos.count,
        }

        return {
            empleados: empleados,
            usuarios: usuarios,
            empresa: dataEmpresa
        }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

const getUsersApp = async (database) => {
    const newPool = Credenciales(database);
    try {
        const result = await newPool.query("SELECT (e.nombre || \' \' || e.apellido) AS fullname, e.cedula, e.codigo, u.usuario, u.app_habilita, u.id as id_user " +
            "FROM empleados AS e, usuarios AS u WHERE CAST( e.codigo as int) = u.id_empleado")
            .then(result => { return result.rows; })

        if (result.length === 0) return { error: "No hay registros en las tablas de empleado y usuario" }
        return result
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

module.exports = {
    tablasDatabase,
    informacionTabla,
    getfuncionesModulos,
    putfuncionesModulos,
    getEmpresaInfo,
    jsonDataEmpresa,
    getUsersApp,
}