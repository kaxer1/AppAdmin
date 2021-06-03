
class Ciudades {
    fulltime;
    cliente;

    constructor( fulltime, cliente ) {
        this.fulltime = fulltime
        this.cliente = cliente
    }

    async ObtenerCiudades() {
        try {
            return await this.cliente.query('SELECT upper(c.descripcion) AS ciudad, upper(p.descripcion) AS provincia FROM ciudad AS c, provincia AS p WHERE c.prov_id = p.prov_id')
                .then(result => { return result.rows})
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async BusquedaIdCiudad(ciudad, provincia) {
        let ids = await this.fulltime.query('SELECT c.id AS id_ciudad, upper(c.descripcion) AS ciudad, p.id AS id_provincia, upper(p.nombre) AS provincia '+
        'FROM cg_provincias AS p, ciudades AS c WHERE UPPER(c.descripcion) like $1 AND UPPER(p.nombre) like $2',[ciudad, provincia])
                .then(result => { return result.rows});
        if (ids.length === 0) return 0;

        return ids 
    }
}

module.exports = Ciudades; 