const { Credenciales } = require('../utils/credenciales');

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
    const { id, hora_extra, accion_personal, alimentacion, permisos, reportes } = data;
    try {
        const [result] = await newPool.query(
            "UPDATE funciones SET hora_extra = $2, accion_personal = $3, alimentacion = $4, permisos = $5, reportes = $6 WHERE id = $1 RETURNING *",
            [id, hora_extra, accion_personal, alimentacion, permisos, reportes])
            .then(result => { return result.rows; })

        if (result) return result
        return { error: "Erro en la actualizacion de funcionalidad" }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

const getAccessWebEmploy = async (database) => {
    const newPool = Credenciales(database);
    try {
        const [ result ] = await newPool.query("SELECT web_access FROM empleados LIMIT 1")
            .then(result => { return result.rows; })
        console.log(result);
        if (result) return result
        return { error: "Error al obtener campo web_access" }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

const putAccessWebEmploy = async (database, data) => {
    const newPool = Credenciales(database);
    const { web_access } = data;
    try {
        const result = await newPool.query(
            "UPDATE empleados SET web_access = $1 ",
            [web_access])
            .then(result => { return result.command ; })
        console.log(result);
        if (result === 'UPDATE') return {web_access: web_access}
        return { error: "Erro en la actualizacion de Acceso a la aplicaicon web" }
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

module.exports = {
    getfuncionesModulos,
    putfuncionesModulos,
    getAccessWebEmploy,
    putAccessWebEmploy
}