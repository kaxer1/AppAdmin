const Pool = require('pg-pool');
const excel = require('xlsx');
const md5 = require('md5');

async function empleados(args) { 
    console.log(args);
    const { path, optionsQueryFT3 } = args;

    const pool = new Pool(optionsQueryFT3);
    const workbook = excel.readFile(path);
    const [ sheet_name_list ] = workbook.SheetNames;
    console.log(sheet_name_list);

    const validacion_sheet = 'EmpleadoData';
    if (sheet_name_list === undefined) return { err: 'El archivo no tiene hoja de empleado'}
    if (sheet_name_list !== validacion_sheet) return { err: 'No coincide el nombre de la hoja de empleado'}

    const dataExcel = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list]);

    if (dataExcel.length === 0 ) return { err: 'no hay datos en la hojas de empleado'}

    const options_sexo = [
        { value: 1, text: "M"},
        { value: 2, text: "F"}
    ];

    const options_estado = [
        { value: 1, text: 0},
        { value: 2, text: 1}
    ];

    const CORREO = 'ejemplo@mail.com';
    const ID_ROL = 2; // empleado
    const esta_civil = 1; // soltero

    for (let i = 0; i < dataExcel.length; i++) {
        const { CODIGO, NOMBRE, APELLIDO, CEDULA, DIRECCION, TELEFONO, FECHANACIMIENTO, NACIONALIDAD, SEXO, ACTIVO } = dataExcel[i];
        const USUARIO = CEDULA;
        console.log('fecha; ',FECHANACIMIENTO.trim());
        const fecha_nacimiento = (FECHANACIMIENTO.trim() === '') ? '01/01/1900' : FECHANACIMIENTO.trim();

        if ( CEDULA ) {

            try {

                // const [ esta_civil ] = options_civil.filter(o => { return o.text.indexOf(ESTADO_CIVIL) !== -1 }).map(o => { return o.value})
                const [ estado ] = options_estado.filter(o => { return o.text === ACTIVO }).map(o => { return o.value})
                const [ genero ] = options_sexo.filter(o => { return o.text.indexOf(SEXO) !== -1 }).map(o => { return o.value})
                const [ id_nacionalidad ] = await pool.query('SELECT id FROM nacionalidades WHERE UPPER(nombre) = $1',[NACIONALIDAD.toUpperCase()]).then(res => {return res.rows}) 
                const [ obj_existe ] = await pool.query('SELECT id FROM empleados WHERE cedula = $1',[CEDULA]).then(res => {return res.rows})

                let clave = md5(CEDULA);

                if (obj_existe) {
                    console.log('Ya existe EMPLEADO', obj_existe);
                    // empleados[i]['ID USUARIO'] = obj_existe.id;
                    await insertUser(USUARIO, clave, ID_ROL, obj_existe.id, pool)
                } else {
                    const id_nacio = (id_nacionalidad === undefined) ? 96 : id_nacionalidad.id;

                    const [ obj ] = await pool.query('INSERT INTO empleados ( cedula, apellido, nombre, esta_civil, genero, correo, fec_nacimiento, estado, domicilio, telefono, id_nacionalidad, codigo ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id', 
                        [CEDULA, APELLIDO, NOMBRE, esta_civil, genero, CORREO, fecha_nacimiento, estado, DIRECCION, TELEFONO, id_nacio, CODIGO ]).then(result => {
                        console.log('INSERT EMPLEADO ', result.rows);
                        return result.rows
                    });
        
                    if (obj) {
                        // empleados[i]['ID USUARIO'] = obj.id;
                        await insertUser(USUARIO, clave, ID_ROL, obj.id, pool)
                    }
                }

            } catch (error) {
                console.log('funcion empleados; ',error);
                return { err: error.toString() }
            }
        }
    }

    return {message: 'Migracion de empleados exitosa'}
}

const insertUser = async(usuario, clave, ID_ROL, id_empleado, pool) => {
    let app_habilita = true;
    let estado = true;
    try {

        const [ obj_existe ] = await pool.query('SELECT id FROM usuarios WHERE id_empleado = $1',[id_empleado]).then(res => {return res.rows})

        if (obj_existe) {
            console.log('Ya existe USUARIO', obj_existe);
        } else {
            return await pool.query('INSERT INTO usuarios (usuario, contrasena, estado, id_rol, id_empleado, app_habilita) VALUES($1, $2, $3, $4, $5, $6)',
            [usuario, clave, estado, ID_ROL, id_empleado, app_habilita]).then(result => {
                console.log('INSERT usuarios ', usuario);
                return result.rows
            });
        }
    } catch (error) {
        console.log('funcion insertUser; ',error);
        return { err: error.toString() }
    }
}

async function departamentos(args) { 
    console.log(args);
    const { path, optionsQueryFT3 } = args;

    const pool = new Pool(optionsQueryFT3);
    const workbook = excel.readFile(path);
    const [ sheet_name_list ] = workbook.SheetNames;
    console.log(sheet_name_list);

    const validacion_sheet = 'DepartamData';
    if (sheet_name_list === undefined) return { err: 'El archivo no tiene hoja de departamento'}
    if (sheet_name_list !== validacion_sheet) return { err: 'No coincide el nombre de la hoja de departamento'}

    const dataExcel = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list]);

    if (dataExcel.length === 0 ) return { err: 'no hay datos en la hojas de departamento'}
    const SUCURSAL = 1
    for (let i = 0; i < dataExcel.length; i++) {
        const { DESCRIPCION } = dataExcel[i];
        if ( DESCRIPCION ) {

            try {
                const [ obj_existe ] = await pool.query('SELECT id FROM cg_departamentos WHERE nombre = $1 AND id_sucursal = $2',[DESCRIPCION, SUCURSAL]).then(res => {return res.rows})

                if (obj_existe) {
                    console.log('Ya existe departamento', obj_existe);
                } else {
                    const [ obj ] = await pool.query('INSERT INTO cg_departamentos( nombre, id_sucursal ) VALUES($1, $2) RETURNING id', [DESCRIPCION, SUCURSAL]).then(result => {
                        console.log('INSERT departamento_propuesto ', result.rows);
                        return result.rows
                    });
        
                    // if (obj) {
                    // }
                }
            } catch (error) {
                return { err: error.toString() }
            }
        }
    }    

    return {message: 'Migracion de departamento exitosa'}
}

async function cargos(args) { 
    console.log(args);
    const { path, optionsQueryFT3 } = args;

    const pool = new Pool(optionsQueryFT3);
    const workbook = excel.readFile(path);
    const [ sheet_name_list ] = workbook.SheetNames;
    console.log(sheet_name_list);
    const validacion_sheet = 'CargoData';
    if (sheet_name_list === undefined) return { err: 'El archivo no tiene hoja de cargos'}
    if (sheet_name_list !== validacion_sheet) return { err: 'No coincide el nombre de la hoja de cargos'}

    const dataExcel = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list]);

    if (dataExcel.length === 0 ) return { err: 'no hay datos en la hojas de empleado'}

    for (let i = 0; i < dataExcel.length; i++) {
        const { DESCRIPCION } = dataExcel[i];
        if ( DESCRIPCION ) {

            try {

                const [ obj_existe ] = await pool.query('SELECT id FROM cargo_propuesto WHERE descripcion = $1',[DESCRIPCION]).then(res => {return res.rows})

                if (obj_existe) {
                    console.log('Ya existe CARGO', obj_existe);
                } else {
                    const [ obj ] = await pool.query('INSERT INTO cargo_propuesto( descripcion ) VALUES($1) RETURNING id', [DESCRIPCION]).then(result => {
                        console.log('INSERT cargo_propuesto ', result.rows);
                        return result.rows
                    });
        
                    // if (obj) {
                    // }
                }
            } catch (error) {
                return { err: error.toString() }
            }
        }
    }

    return {message: 'todo a salido bien'}
}

async function timbres(args) { 
    console.log(args);
    const { path, optionsQueryFT3 } = args;

    const pool = new Pool(optionsQueryFT3);
    const workbook = excel.readFile(path);
    const sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list);

    setTimeout(() => {
        console.log('paso 5 segundos TIMBRES');
    }, 5000);


    return {message: 'todo a salido bien'}
}

async function empresa(args) { 
    console.log(args);
    const { path, optionsQueryFT3 } = args;

    const pool = new Pool(optionsQueryFT3);
    const workbook = excel.readFile(path);
    const [sheet_name_list] = workbook.SheetNames;
    console.log(sheet_name_list);
    const validacion_sheet = 'EmpresaData';
    if (sheet_name_list === undefined) return { err: 'El archivo no tiene hoja de empresa'}
    if (sheet_name_list !== validacion_sheet) return { err: 'No coincide el nombre de la hoja de empresa'}

    const dataExcel = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list]);

    if (dataExcel.length === 0 ) return { err: 'no hay datos en la hojas de empresa'}

    for (let i = 0; i < dataExcel.length; i++) {
        const { NOMBRE, RUC, DIRECCION, TELEFONO, CORREO, REPRESENTANTE } = dataExcel[i];
        if ( NOMBRE ) {

            try {

                const [ obj_existe ] = await pool.query('SELECT id FROM cg_empresa WHERE ruc = $1',[RUC]).then(res => {return res.rows})

                if (obj_existe) {
                    console.log('Ya existe EMPRESA', obj_existe);
                    // dataExcel[i]['ID'] = obj_existe.id;
                } else {
                    const [ obj ] = await pool.query('INSERT INTO cg_empresa(nombre, ruc, direccion, telefono, correo, representante ) VALUES($1, $2, $3, $4, $5, $6) RETURNING id', 
                        [NOMBRE, RUC, DIRECCION, TELEFONO, CORREO, REPRESENTANTE ]).then(result => {
                        console.log('INSERT empresa ', result.rows);
                        return result.rows
                    });
        
                    // if (obj) {
                    //     empresa[i]['ID'] = obj.id;
                    // }
                }
            } catch (error) {
                return { err: error.toString() }
            }
        }
    }
    
    return { message: 'Empresa ingresada correctamento'}
}

async function sucursal(args) { 
    console.log(args);
    const { path, optionsQueryFT3 } = args;

    const pool = new Pool(optionsQueryFT3);
    const workbook = excel.readFile(path);
    const [ sheet_name_list ] = workbook.SheetNames;
    console.log(sheet_name_list);

    const validacion_sheet = 'SucursalData';
    if (sheet_name_list === undefined) return { err: 'El archivo no tiene hoja de sucursal'}
    if (sheet_name_list !== validacion_sheet) return { err: 'No coincide el nombre de la hoja de sucursal'}

    const dataExcel = excel.utils.sheet_to_json(workbook.Sheets[sheet_name_list]);

    if (dataExcel.length === 0 ) return { err: 'no hay datos en la hojas de empresa'}

    for (let i = 0; i < dataExcel.length; i++) {
        const { NOMBRE, CIUDAD, EMPRESA } = dataExcel[i];

        if (NOMBRE) {
            
            try {
                
                const [ id_ciudad ] = await pool.query('SELECT id FROM ciudades WHERE UPPER(descripcion) = $1 ',[CIUDAD.toUpperCase()]).then(res => {return res.rows})
                const [ id_empresa ] = await pool.query('SELECT id FROM cg_empresa WHERE UPPER(nombre) = $1 ',[EMPRESA.toUpperCase()]).then(res => {return res.rows})
                console.log(id_ciudad, CIUDAD.toUpperCase());
                console.log(id_empresa, EMPRESA.toUpperCase());
                if (id_ciudad.id !== undefined && id_empresa.id !== undefined ) {

                    const [ obj_existe ] = await pool.query('SELECT id FROM sucursales WHERE nombre = $1',[NOMBRE]).then(res => {return res.rows})

                    if (obj_existe) {
                        console.log('Ya existe SUCURSAL', obj_existe);
                    } else {

                        const [ obj ] = await pool.query('INSERT INTO sucursales( nombre, id_ciudad, id_empresa ) VALUES($1, $2, $3) RETURNING id',
                            [NOMBRE, id_ciudad.id, id_empresa.id]).then(result => {
                                console.log('INSERT sucursal ', result.rows);
                                return result.rows
                            });
            
                        // if (obj) {
                        //     sucursal[i]['ID SECUENCIAL'] = obj.id;
                        // }
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

  
    return { message: 'Sucursales ingresada correctamento'}
}

module.exports = {
    empleados,
    departamentos,
    cargos,
    timbres,
    empresa,
    sucursal
}
