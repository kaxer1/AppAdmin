const md5 = require('md5');

class Empleados {

    fulltime;
    cliente;

    constructor(fulltime, cliente) {
        this.fulltime = fulltime
        this.cliente = cliente
    }

    async ObtenerEmpleados() {
        try {
            return await this.cliente.query('SELECT e.horas_trabaja, e.sueldo, e.controla_vacacion, e.cedula, e.nombre, e.apellido, e.estado_civil, e.sexo, e.correo, e.fecha_nacimiento, e.estado, e.correo_alternativo, e.codigo_empleado, u.usuario, e.empl_id AS id, e.empl_id, e.dgco_id, e.depa_id, e.carg_id, e.relo_id, e.carg_id AS id_cargo FROM empleado AS e, usuarios AS u WHERE e.id = u.id ORDER BY e.empl_id')
                .then(result => {
                    return result.rows.map(obj => {
                        obj.id_cargo = 0;
                        // obj.relo_id === null ? obj.relo_id = 1 : 
                        (obj.controla_vacacion === 0) ? obj.controla_vacacion = true : obj.controla_vacacion = false;
                        (obj.estado === 5) ? obj.estado = 1 : obj.estado = 2;
                        switch (obj.estado_civil) {
                            case 7:
                                obj.estado_civil = 1;
                                break;
                            case 8:
                                obj.estado_civil = 2;
                                break;
                            case 9:
                                obj.estado_civil = 3;
                                break;
                            case 10:
                                obj.estado_civil = 4;
                                break;
                            default:
                                obj.estado_civil = 5;
                                break;
                        }
                        return obj
                    })
                })
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async setContrato(obj) {
        try {
            let id_regimen = await this.fulltime.query('SELECT id FROM cg_regimenes WHERE UPPER(descripcion) like $1', [obj.dgco_id.regimen]).then(result => { return result.rows[0].id })

            return await this.fulltime.query('INSERT INTO empl_contratos (id_empleado, fec_ingreso, fec_salida, vaca_controla, asis_controla, id_regimen) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
                [obj.id, obj.dgco_id.fechas[0].fecha_ingreso, obj.dgco_id.fechas[0].fecha_salida, obj.controla_vacacion, true, id_regimen])
                .then(result => {
                    console.log(result.command, 'Contrato', obj.id);
                    obj.carg_id.id_empl_contrato = result.rows[0].id
                    return obj
                })
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async setCargos(obj, id_depa, id_suc) {
        try {
            let sueldo = parseInt(obj.sueldo);
            (sueldo === 0) ? obj.sueldo = parseInt(obj.carg_id.cargo[0].sueldo) : obj.sueldo = sueldo;

            return await this.fulltime.query('INSERT INTO empl_cargos(id_empl_contrato, id_departamento, fec_inicio, fec_final, id_sucursal, sueldo, hora_trabaja, cargo) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
                [obj.carg_id.id_empl_contrato, id_depa, obj.dgco_id.fechas[0].fecha_ingreso, obj.dgco_id.fechas[0].fecha_salida, id_suc, obj.sueldo, obj.horas_trabaja, obj.carg_id.cargo[0].descripcion])
                .then(result => {
                    console.log(result.command, 'Cargo', obj.carg_id.id_empl_contrato);
                    obj.id_cargo = result.rows[0].id
                    return obj
                });
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async SetEmpleados(lista_empleados) {
        try {
            // console.log(lista_empleados);
            return Promise.all(lista_empleados.map(async (obj) => {
                const [id_empleado] = await this.fulltime.query('SELECT id FROM empleados WHERE cedula = $1', [obj.cedula]).then(result => { return result.rows })
                // console.log('Consulta 1: ',id_empleado);
                if (!id_empleado) {
                    obj.id = await this.fulltime.query('INSERT INTO empleados(cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, id_nacionalidad, codigo) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id', [obj.cedula, obj.apellido, obj.nombre, obj.estado_civil, obj.sexo, obj.correo, obj.fecha_nacimiento, obj.estado, obj.correo_alternativo, 94, obj.codigo_empleado])
                        .then(async (res) => {
                            console.log(res.command, 'Empleado', res.rows[0].id);
                            const { id } = res.rows[0];
                            let clave = md5(obj.cedula);
                            await this.fulltime.query('INSERT INTO usuarios(usuario, contrasena, estado, id_rol, id_empleado, app_habilita) VALUES($1, $2, $3, $4, $5, $6)', [obj.usuario, clave, true, 2, id, true]);
                            return id
                        });
                } else {
                    obj.id = id_empleado.id
                }
                obj.dgco_id = {
                    regimen: await this.cliente.query('SELECT upper(descripcion) AS descripcion FROM detalle_grupo_contratado WHERE dgco_id = $1', [obj.dgco_id]).then(restult => { return restult.rows[0].descripcion }),
                    fechas: await this.cliente.query('SELECT fecha_ingreso, fecha_salida FROM hist_labo WHERE empl_id = $1', [obj.empl_id]).then(result => {
                        if (result.rows.length === 0) {
                            return [{ fecha_ingreso: new Date, fecha_salida: null }]
                        } else {
                            return result.rows
                        }
                    })
                }
                obj.carg_id = {
                    cargo: await this.cliente.query('SELECT descripcion, sueldo FROM cargo WHERE carg_id = $1', [obj.carg_id]).then(result => { return result.rows }),
                    id_empl_contrato: 0,
                }
                return obj
            }));
        } catch (error) {
            return { err: error.toString() }
        }
    }

    async SetAdmin(cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, id_nacionalidad, codigo, usuario, id_rol, app_habilita) {
        try {
            let id = await this.fulltime.query('INSERT INTO empleados(cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, id_nacionalidad, codigo) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id', [cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, mail_alternativo, id_nacionalidad, codigo])
                .then(result => {
                    console.log(result.command);
                    return result.rows[0].id;
                });
            let clave = md5(cedula);
            console.log(clave);
            await this.fulltime.query('INSERT INTO usuarios(usuario, contrasena, estado, id_rol, id_empleado, app_habilita) VALUES($1, $2, $3, $4, $5, $6)', [usuario, clave, true, id_rol, id, app_habilita])
        } catch (error) {
            return { err: error.toString() }
        }
    }

}

module.exports = Empleados;