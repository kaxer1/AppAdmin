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

module.exports = {
    getfuncionesModulos,
    putfuncionesModulos
}