const { Credenciales } = require('../utils/credenciales');

const getUsersApp = async (database) => {
    const newPool = Credenciales(database);
    try {
        const result = await newPool.query("SELECT (e.nombre || \' \' || e.apellido) AS fullname, e.cedula, e.codigo, u.usuario, u.app_habilita, u.id as id_user " + 
        "FROM empleados AS e, usuarios AS u WHERE e.id = u.id_empleado")
            .then(result => { return result.rows; })

        if (result.length === 0) return { err: "No hay registros en las tablas de empleado y usuario" }
        return result
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

const putUserApp = async (database, data) => {
    const newPool = Credenciales(database);
    try {
        const { value, id_user } = data
        const response = newPool.query("UPDATE usuarios SET app_habilita = $1 WHERE id = $2 RETURNING app_habilita",[value, id_user])
        .then(result => { return result.rows })
        return response
    } catch (error) {
        console.log(error);
        return { err: error.toString() }
    }
}

module.exports = {
    getUsersApp,
    putUserApp
}