
class Timbres {

    fulltime;
    cliente;

    constructor( fulltime, cliente ) {
        this.fulltime = fulltime
        this.cliente = cliente
    }

    async ObtenerRelojesCliente() {
        try {
            return await this.cliente.query('SELECT relo_id, relo_id AS id, descripcion, ip, puerto_com, marca, modelo, serie FROM reloj').then(result => { return result.rows});
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async setRelojes(lista_relojes, id_depa, id_suc) {
        try {
            return Promise.all(lista_relojes.map(async(obj) => {
                obj.id = await this.fulltime.query('INSERT INTO cg_relojes (nombre, ip, puerto, marca, modelo, serie, tien_funciones, id_sucursal, id_departamento) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
                [obj.descripcion, obj.ip, obj.puerto_com, obj.marca, obj.modelo, obj.serie, true, id_depa, id_suc])
                .then(result => { console.log(result.command, 'reloj', obj.descripcion ); return result.rows[0].id})
                return obj
            }))
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async ObtenerRelojesIngresados() {
        try {
            return await this.fulltime.query('SELECT id, nombre FROM cg_relojes ORDER BY id ASC').then(res => { return res.rows})
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async ObtenerTimbres() {
        try {
            return await this.cliente.query('SELECT fecha_hora_timbre, accion, tecla_funcion, observacion, latitud, longitud, codigo_reloj, codigo_empleado FROM timbre ORDER BY fecha_hora_timbre LIMIT 10000')
                .then(result => { return result.rows})
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async SetTimbre(obj, id_reloj) {
        try {
            return await this.fulltime.query('INSERT INTO timbres (fec_hora_timbre, accion, tecl_funcion, observacion, latitud, longitud, id_empleado, id_reloj) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
            [obj.fecha_hora_timbre, obj.accion, obj.tecla_funcion, obj.observacion, obj.latitud, obj.longitud, obj.codigo_empleado, id_reloj])
            .then(result => {
                // console.log(result.command, 'timbre: ', result.rows[0].id);
                return 1 
            });
        } catch (error) {
            return { err: error.toString() }
        }
    }
}

module.exports = Timbres; 