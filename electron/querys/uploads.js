const excel = require('xlsx')
const { Credenciales } = require('../utils/credenciales');
const md5 = require('md5');

const fileUpload = async (file) => {

    console.log(file);
    const newPool = Credenciales(file.name_database);
    const workbook = excel.readFile(file.path);
    const sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list);

    const validacion_empresa = sheet_name_list.find(o => { return o === 'Empresa'})
    if (validacion_empresa === undefined) return { err: 'Revise las hojas de excel. No se ha encontrado la hoja de Empresa'}
    
    const validacion_sucursal = sheet_name_list.find(o => { return o === 'Sucursal'})
    if (validacion_sucursal === undefined) return { err: 'Revise las hojas de excel. No se ha encontrado la hoja de Sucursal'}
    
    const validacion_cargo = sheet_name_list.find(o => { return o === 'Cargo'})
    if (validacion_cargo === undefined) return { err: 'Revise las hojas de excel. No se ha encontrado la hoja de Cargo'}
    
    const validacion_depar = sheet_name_list.find(o => { return o === 'Departamentos'})
    if ( validacion_depar === undefined) return { err: 'Revise las hojas de excel. No se ha encontrado la hoja de Departamentos'}
    
    const validacion_empl = sheet_name_list.find(o => { return o === 'Empleados'})
    if (validacion_empl === undefined) return { err: 'Revise las hojas de excel. No se ha encontrado la hoja de Empleados'}

    
    const dataExcel = sheet_name_list.map(sheet_name => {
        return {
            sheet: sheet_name,
            datos: excel.utils.sheet_to_json(workbook.Sheets[sheet_name])
        }
    })
    // console.log(dataExcel);
    let Obj_message = {
        message: 'FIN DE EXPORTACIÓN',
        empresa: {},
        sucursal: {},
        cargo: {},
        departamento: {},
        empleados: {}
    }

    for (let i = 0; i < dataExcel.length; i++) {
        const sheet_data = dataExcel[i];

        if (sheet_data.datos.length === 0) return { err: `Revise las hojas de excel. La hoja ${sheet_data.sheet} no tiene registros`}

        switch (sheet_data.sheet) {
            case 'Empresa':
                Obj_message.empresa = await InsertarEmpresa(sheet_data.datos, newPool)
                break;
            case 'Sucursal':
                Obj_message.sucursal = await InsertarSucursal(sheet_data.datos, newPool)
                break;
            case 'Cargo':
                Obj_message.cargo = await InsertarCargo(sheet_data.datos, newPool)
                break;
            case 'Departamentos':
                Obj_message.departamento = await InsertarDepartamento(sheet_data.datos, newPool)
                break;
            case 'Empleados':
                Obj_message.empleados = await InsertarEmpleados(sheet_data.datos, newPool)
                break;
            default:
                break;
        }
    }

    console.log(Obj_message);

    return Obj_message
}

const InsertarEmpresa = async(empresa, newPool) => {
    console.log('********************* METODO PARA INSERTAR EMPRESA ********************');
    for (let i = 0; i < empresa.length; i++) {
        const { NOMBRE, RUC, DIRECCION, TELEFONO, CORREO, REPRESENTANTE } = empresa[i];
        if ( NOMBRE ) {

            try {

                const [ obj_existe ] = await newPool.query('SELECT id FROM cg_empresa WHERE ruc = $1',[RUC]).then(res => {return res.rows})

                if (obj_existe) {
                    console.log('Ya existe EMPRESA', obj_existe);
                    empresa[i]['ID'] = obj_existe.id;
                } else {
                    const [ obj ] = await newPool.query('INSERT INTO cg_empresa(nombre, ruc, direccion, telefono, correo, representante ) VALUES($1, $2, $3, $4, $5, $6) RETURNING id', 
                        [NOMBRE, RUC, DIRECCION, TELEFONO, CORREO, REPRESENTANTE ]).then(result => {
                        console.log('INSERT empresa ', result.rows);
                        return result.rows
                    });
        
                    if (obj) {
                        empresa[i]['ID'] = obj.id;
                    }
                }
            } catch (error) {
                return { err: error.toString() }
            }
        }
    }
    // for (let i = 0; i < empresa.length; i++) {
    //     console.log('Empresa',empresa[i]);
    // }
    return { message: 'Empresa ingresada correctamento'}
}

const InsertarSucursal = async(sucursal, newPool) => {
    // console.log('********************* METODO PARA INSERAR SUCURSAL ********************');
    for (let i = 0; i < sucursal.length; i++) {
        const { NOMBRE, CIUDAD, EMPRESA } = sucursal[i];

        if (NOMBRE) {
            
            try {
                
                const [ id_ciudad ] = await newPool.query('SELECT id FROM ciudades WHERE UPPER(descripcion) = $1 ',[CIUDAD.toUpperCase()]).then(res => {return res.rows})
                const [ id_empresa ] = await newPool.query('SELECT id FROM cg_empresa WHERE UPPER(nombre) = $1 ',[EMPRESA.toUpperCase()]).then(res => {return res.rows})
                console.log(id_ciudad, CIUDAD.toUpperCase());
                console.log(id_empresa, EMPRESA.toUpperCase());
                if (id_ciudad.id !== undefined && id_empresa.id !== undefined ) {

                    const [ obj_existe ] = await newPool.query('SELECT id FROM sucursales WHERE nombre = $1',[NOMBRE]).then(res => {return res.rows})

                    if (obj_existe) {
                        console.log('Ya existe SUCURSAL', obj_existe);
                        sucursal[i]['ID'] = obj_existe.id;
                    } else {

                        const [ obj ] = await newPool.query('INSERT INTO sucursales( nombre, id_ciudad, id_empresa ) VALUES($1, $2, $3) RETURNING id',
                            [NOMBRE, id_ciudad.id, id_empresa.id]).then(result => {
                                console.log('INSERT sucursal ', result.rows);
                                return result.rows
                            });
            
                        if (obj) {
                            sucursal[i]['ID SECUENCIAL'] = obj.id;
                        }
                    }
                } else {
                    // console.log({ err: 'Ciudad o empresa no encontrada', ciudad: CIUDAD, empresa: EMPRESA});
                    return { err: 'Ciudad o empresa no encontrada', ciudad: CIUDAD, empresa: EMPRESA}
                }

            } catch (error) {
                return { err: error.toString() }
            }
        }

    }

    // for (let i = 0; i < sucursal.length; i++) {
    //     console.log('Sucursal',sucursal[i]);
    // }
    return { message: 'Sucursales ingresada correctamento'}
}

const InsertarCargo = async(cargos, newPool) => {
    console.log('********************* METODO PARA INSERAR CARGO PROPUESTO ********************');
    for (let i = 0; i < cargos.length; i++) {
        const { DESCRIPCION } = cargos[i];
        if ( DESCRIPCION ) {

            try {

                const [ obj_existe ] = await newPool.query('SELECT id FROM cargo_propuesto WHERE descripcion = $1',[DESCRIPCION]).then(res => {return res.rows})

                if (obj_existe) {
                    console.log('Ya existe CARGO', obj_existe);
                    cargos[i]['ID SECUENCIAL'] = obj_existe.id;
                } else {
                    const [ obj ] = await newPool.query('INSERT INTO cargo_propuesto( descripcion ) VALUES($1) RETURNING id', [DESCRIPCION]).then(result => {
                        console.log('INSERT cargo_propuesto ', result.rows);
                        return result.rows
                    });
        
                    if (obj) {
                        cargos[i]['ID SECUENCIAL'] = obj.id;
                    }
                }
            } catch (error) {
                return { err: error.toString() }
            }
        }
    }

    return { message: 'Cargos ingresada correctamento'}
}

const InsertarDepartamento = async(departamentos, newPool) => {
    console.log('********************* METODO PARA INSERAR DEPARTAMENTO ********************', departamentos.length);
    for (let i = 0; i < departamentos.length; i++) {
        const { DESCRIPCION, SUCURSAL } = departamentos[i];
        if ( DESCRIPCION ) {

            try {
                const [ obj_existe ] = await newPool.query('SELECT id FROM cg_departamentos WHERE nombre = $1 AND id_sucursal = $2',[DESCRIPCION, SUCURSAL]).then(res => {return res.rows})

                if (obj_existe) {
                    console.log('Ya existe departamento', obj_existe);
                    departamentos[i]['ID SECUENCIAL'] = obj_existe.id;
                } else {
                    const [ obj ] = await newPool.query('INSERT INTO cg_departamentos( nombre, id_sucursal ) VALUES($1, $2) RETURNING id', [DESCRIPCION, SUCURSAL]).then(result => {
                        console.log('INSERT departamento_propuesto ', result.rows);
                        return result.rows
                    });
        
                    if (obj) {
                        departamentos[i]['ID SECUENCIAL'] = obj.id;
                    }
                }
            } catch (error) {
                return { err: error.toString() }
            }
        }
    }
    
    // for (let i = 0; i < departamentos.length; i++) {
    //     console.log('Departamento:', departamentos[i]);
    // }
    
    return { message: 'Departamentos ingresada correctamento'}
}

const InsertarEmpleados = async(empleados, newPool) => {
    console.log('********************* METODO PARA INSERAR EMPLEADOS ********************');
    const ESTADO = 1;
    const options_civil = [
        { value: 1, text: "Soltero ( a )"},
        { value: 2, text: "Casado ( a )"},
        { value: 3, text: "Viudo ( a )"},
        { value: 4, text: "Divorciado ( a )"},
        { value: 5, text: "Unión de Hecho"} 
    ];

    const options_sexo = [
        { value: 1, text: "Masculino"},
        { value: 2, text: "Femenino"}
    ];

    for (let i = 0; i < empleados.length; i++) {
        const { ID_NACIONALIDAD, CEDULA, APELLIDOS, NOMBRES, ESTADO_CIVIL, SEXO, CORREO, FECHA_NACIMIENTO, USUARIO, CONTRASENIA, ID_ROL } = empleados[i];
        const CODIGO = empleados[i]['CODIGO EMPLEADO EN EL RELOG'];
        //     [1]   'ID CIUDAD': 'QUITO',
        //     [1]   'ID CARGO': 'Secretaria General',
        //     [1]   'ID DETALLE GRUPO CONTRATADO': 'LOSEP',
        //     [1]   'ID DEPARTAMENTO': 'TURISMO E INTERCULTURALIDAD',
        //     [1]   'FECHA INGRESO': 43837,
        //     [1]   'HORAS TRABAJADAS': 8,
        if ( CEDULA ) {

            try {

                const [ esta_civil ] = options_civil.filter(o => { return o.text.indexOf(ESTADO_CIVIL) !== -1 }).map(o => { return o.value})
                const [ genero ] = options_sexo.filter(o => { return o.text.indexOf(SEXO) !== -1 }).map(o => { return o.value})
                const [ id_nacionalidad ] = await newPool.query('SELECT id FROM nacionalidades WHERE UPPER(nombre) = $1',[ID_NACIONALIDAD.toUpperCase()]).then(res => {return res.rows}) 
                const [ obj_existe ] = await newPool.query('SELECT id FROM empleados WHERE cedula = $1',[CEDULA]).then(res => {return res.rows})

                let clave = md5(CONTRASENIA);

                if (obj_existe) {
                    console.log('Ya existe EMPLEADO', obj_existe);
                    // empleados[i]['ID USUARIO'] = obj_existe.id;
                    await insertUser(USUARIO, clave, ID_ROL, obj_existe.id, newPool)
                } else {
                    const [ obj ] = await newPool.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, id_nacionalidad, codigo ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id', 
                        [CEDULA, APELLIDOS, NOMBRES, esta_civil, genero, CORREO, FECHA_NACIMIENTO, ESTADO, id_nacionalidad.id, CODIGO ]).then(result => {
                        console.log('INSERT EMPLEADO ', result.rows);
                        return result.rows
                    });
        
                    if (obj) {
                        // empleados[i]['ID USUARIO'] = obj.id;
                        await insertUser(USUARIO, clave, ID_ROL, obj.id, newPool)
                    }
                }

            } catch (error) {
                return { err: error.toString() }
            }
        }
    }

    return { message: 'Empleados ingresada correctamento'}
}

const insertUser = async(usuario, clave, ID_ROL, id_empleado, newPool) => {
    let app_habilita = true;
    let estado = true;
    try {

        const [ obj_existe ] = await newPool.query('SELECT id FROM usuarios WHERE id_empleado = $1',[id_empleado]).then(res => {return res.rows})

        if (obj_existe) {
            console.log('Ya existe USUARIO', obj_existe);
        } else {
            return await newPool.query('INSERT INTO usuarios (usuario, contrasena, estado, id_rol, id_empleado, app_habilita) VALUES($1, $2, $3, $4, $5, $6)',
            [usuario, clave, estado, ID_ROL, id_empleado, app_habilita]).then(result => {
                console.log('INSERT usuarios ', result.rows);
                return result.rows
            });
        }
    } catch (error) {
        return { err: error.toString() }
    }
}

module.exports = {
    fileUpload
}


// const InsertarCiudad = async(ciudades, newPool) => {
//     console.log('********************* METODO PARA INSERAR CIUDAD ********************');
//     ciudades.forEach(o => {
//         console.log(o);
//     })
// }