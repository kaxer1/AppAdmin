
class Empresa {
    
    fulltime;
    cliente;

    constructor( fulltime, cliente ) {
        this.fulltime = fulltime
        this.cliente = cliente
    }
    /**
     * tipo empresa => Pública, Privada, ONG, Persona Natural, Otro. 
     * establecimiento => Sucursales, Agencias, Otro.
     * cambios => true, false
     */

    async getEmpresa() {
        try {
            return await this.fulltime.query('SELECT id, establecimiento FROM cg_empresa').then(result => { return result.rows});
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async setEmpresa(nombre, ruc, direccion, telefono, correo, representante, tipo_empresa, establecimiento, dias_cambio, cambios) {
        try {
            return await this.fulltime.query('INSERT INTO cg_empresa (nombre, ruc, direccion, telefono, correo, representante, tipo_empresa, establecimiento, dias_cambio, cambios) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id, establecimiento',[nombre, ruc, direccion, telefono, correo, representante, tipo_empresa, establecimiento, dias_cambio, cambios])
            .then(result => { 
                console.log(result.command);
                return result.rows[0];
            })
            .catch(err => { console.log(err);});
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async setSucursales(nombre, id_ciudad, id_empresa) {
        if (nombre.split(' ')[0] === 'Sucursales') {
            nombre = 'SUCURSAL ' + nombre.split(' ')[1]; 
        } else if (nombre.split(' ')[0] === 'Agencias') {
            nombre = 'AGENCIA ' + nombre.split(' ')[1]; 
        } else {
            nombre = nombre.toUpperCase();
        }
        // console.log(nombre, id_ciudad, id_empresa);

        try {
            let [ sucursal ]  = await this.getSucursal(nombre, id_ciudad, id_empresa);
            // console.log('Suc: ----', sucursal);
            if ( !sucursal ) {
                return await this.fulltime.query('INSERT INTO sucursales (nombre, id_ciudad, id_empresa) VALUES($1, $2, $3) RETURNING id, nombre',[nombre, id_ciudad, id_empresa])
                .then(result => { 
                    console.log( result.command, ' sucursal');
                    return result.rows[0]
                })
                .catch(err => { console.log(err);})
            } else {
                console.log('Ya existe sucursal con esos datos.');
                return sucursal
            }
        } catch (error) {
            return { err: error.toString() }
        }
    }
    
    async getSucursal(nombre, id_ciudad, id_empresa) {
        try {
            return await this.fulltime.query('SELECT id, nombre FROM sucursales WHERE nombre like $1 AND id_ciudad = $2 AND id_empresa = $3',[nombre, id_ciudad, id_empresa]).then(result => {return result.rows})
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async getDepartamentosCliente() {
        try {
            return await this.cliente.query('SELECT depa_id, dep_depa_id, depa_id AS id, dep_depa_id AS depa_padre, descripcion AS nombre, nivel, empl_id FROM departamento ORDER BY id').then(result => { return result.rows});
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async setDepatamentoFulltime(nombre, nivel, id_sucursal) {
        try {
            const [ comparar ] = await this.CompararDepartamentos(nombre, id_sucursal);
            console.log('Set Departamento fulltime v3: ----', comparar);
            if ( !comparar ) {
                console.log(nombre, nivel, id_sucursal);
                return await this.fulltime.query('INSERT INTO cg_departamentos(nombre, nivel, id_sucursal) VALUES($1, $2, $3) RETURNING id',[nombre, nivel, id_sucursal])
                .then(result => { 
                    console.log(result.command, 'Departamento', result.rows[0].id)
                    return result.rows[0].id
                });
            } else {
                console.log('Departamento existente');
                return comparar.id
            }
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async CompararDepartamentos(nombre, id_sucursal) {
        try {
            return await this.fulltime.query('SELECT id FROM cg_departamentos WHERE nombre like $1 AND id_sucursal = $2 ORDER BY id',[nombre.toString(), id_sucursal])
            .then(result => { return result.rows })
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async updateDepaPadre(id, depa_padre) {
        try {
            return await this.fulltime.query('UPDATE cg_departamentos SET depa_padre = $1 WHERE id = $2', [depa_padre, id])
            // .then(result => { console.log(result.command, id);})
        } catch (error) {
            return { err: error.toString() }
        }
    }
}

module.exports = Empresa; 