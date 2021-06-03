const { CrearConexionClienteFulltime27 } = require('./database_cliente');
const { CrearConexionFulltime3 } = require('./database_Fulltime');

const Pool = require('pg-pool');

const Empresa = require('./Clientes/empresa');
const Ciudades = require('./Clientes/ciudad');
const Empleados = require('./Clientes/empleados');
const Timbres = require('./Clientes/timbres');
const Permisos = require('./Clientes/permisos');

async function main(fulltime3, fulltime2_7) {

    const pool_fulltime3 = new Pool(fulltime3);
    const pool_fulltime2_7 = new Pool(fulltime2_7);

    const empresa = new Empresa(pool_fulltime3, pool_fulltime2_7);
    var lista_empresa = await empresa.getEmpresa();
    if (lista_empresa.err) return lista_empresa 
    console.log(lista_empresa);

    let id_empresa;
    if (lista_empresa.length === 0) {
        id_empresa = await empresa.setEmpresa('Vaca Ortiz', '1783938449001', 'Quito', '02293435', 'vaca_ortiz@gmail.com', 'Jorge Paez', 'Pública', 'Sucursales', 5, true)
    } else {
        id_empresa = lista_empresa[0]
    }
    if (id_empresa.err) return id_empresa
    // console.log('Empresa: ',id_empresa);
    const empleados = new Empleados(pool_fulltime3, pool_fulltime2_7);
    // await empleados.SetAdmin('0503908857','curay lasluisa', 'kevin alexander', 1, 1, 'kevincuray41@gmail.com', '1997-10-11', 1, null, 94, 1, 'kevin', 1, true)


    const ciudad = new Ciudades(pool_fulltime3, pool_fulltime2_7);
    let ciudades = await ciudad.ObtenerCiudades();
    if (ciudades.err) return ciudades 
    // console.log('Ciudades: ', ciudades);
    const ids = await Promise.all(ciudades.map(async(obj) => {
        return await ciudad.BusquedaIdCiudad(obj.ciudad, obj.provincia);
    }));

    let [ filtro_ciudades_Ids ] = ids.filter(obj => { return (obj != 0)})
    // console.log('Filtro ciudad: ',filtro_ciudades_Ids);

    /**
     * INSERTAR SUCURSALES
     */
    let sucursales_ids = await Promise.all(filtro_ciudades_Ids.map(obj => { 
        return empresa.setSucursales( id_empresa.establecimiento + ' ' + obj.ciudad, obj.id_ciudad, id_empresa.id )
    }));
    console.log(sucursales_ids);

    let departamentos = await empresa.getDepartamentosCliente();
    if (departamentos.err) return departamentos 
    console.log(departamentos);

    /**
     * INSERTAR DEPARTAMENTOS
     */
    await Promise.all(departamentos.map(async(obj) => { 
        var id = await empresa.setDepatamentoFulltime(obj.nombre, obj.nivel, sucursales_ids[0].id);
        obj.id = id.toString();
        return obj
    }));

    /**
     * CAMBIAR ids de los departamentos de version antigua a nueva.
     */
    departamentos.map(obj => {
        let index_depa = departamentos.findIndex(depa => depa.depa_id === obj.dep_depa_id);
        obj.depa_padre = departamentos[index_depa].id
        return obj
    })
    departamentos.forEach(async (obj) => {
        await empresa.updateDepaPadre(obj.id, obj.depa_padre)
    });
    // console.log('************************************************************');
    // departamentos.forEach(obj => { console.log(JSON.stringify(obj));})
    // console.log('************************************************************');

    /**
     * INSERTAR CATALOGO DE TIPOS DE PERMISOS
     */
    const tipo_permi = new Permisos(pool_fulltime3, pool_fulltime2_7);
    let lista_tipo_permiso = await tipo_permi.ObtenerTipoPermisos();
    // console.log(lista_tipo_permiso);
    if (lista_tipo_permiso.err) return lista_tipo_permiso

    let cg_tipo_permiso = await Promise.all( lista_tipo_permiso.map(async(obj) => {
        obj.id = await tipo_permi.Set_Cg_tipo_permiso(obj);
        return obj
    }));
    // cg_tipo_permiso.forEach(obj => { console.log(JSON.stringify(obj));})

    /**
     * OBTENER LISTA DE EMPLEADOS DE LA BASE DE DATOS DE LOS CLIENTES. 
     */
    let lista = await empleados.ObtenerEmpleados()
    if ( lista.err ) return lista
    // lista.forEach(obj => { console.log(JSON.stringify(obj));})

    /**
     * INSERTAR EMPLEADOS CON USUARIOS, devuelve un array modelado con los ids del empleado y más datos
     */
    let nuevo_array = await empleados.SetEmpleados(lista);
    nuevo_array.forEach(obj => { console.log(JSON.stringify(obj));})

    // /**
    //  * INSERTAR CG RELOJES [por el momento desactivado porq los timbres ya estan pasados]
    //  */
    // // const timbres = new Timbres(pool_fulltime3, pool_fulltime2_7)
    // // let lista_relojes = await timbres.ObtenerRelojesCliente()
    // // let array_relojes_id = await timbres.setRelojes(lista_relojes, departamentos[0].id ,sucursales_ids[0].id) // en el sistema debe editar el departamente al q pertenece cada reloj
    // // console.log('RELOJES ID', array_relojes_id);


    // /**
    //  * INSERTA CONTRATO DE LOS EMPLEADOS QUE HAN SIDO REGISTRADOS
    //  */
    // let array_con_Contrato = await Promise.all(nuevo_array.map(async(obj) => {
    //     return await empleados.setContrato(obj) 
    // }));
    
    // /**
    //  * INSERTAR CARGO DE ACUERDO AL CONTRATO REGISTRADO.
    //  */
    // let array_con_Cargo = await Promise.all(array_con_Contrato.map(async(obj) => {
    //     let index_depa = departamentos.findIndex(depa => depa.depa_id === obj.depa_id);
    //     return await empleados.setCargos(obj, departamentos[index_depa].id, sucursales_ids[0].id)
    // }))

    // // console.log('************************************************************');
    // // array_con_Cargo.forEach(obj => { console.log(JSON.stringify(obj), '\n');})

    // /**
    //  * INSERTAR PERIODOS DE VACACION 
    //  */
    
    return { message: 'Migración realizada exitosamente', finish: false }
}

async function insertarTimbres(fulltime3, fulltime2_7) {

    const pool_fulltime3 = new Pool(fulltime3);
    const pool_fulltime2_7 = new Pool(fulltime2_7);

    /**
     * INSERTAR TIMBRES
     */
    const timbres = new Timbres(pool_fulltime3, pool_fulltime2_7)
    let [ lista_relojes ] = await timbres.ObtenerRelojesIngresados();

    let timbres_empleado = await timbres.ObtenerTimbres();
    if (timbres_empleado.err) return timbres_empleado

    let cont = 0;
    for (let i = 0; i < timbres_empleado.length; i++) {
        const element = timbres_empleado[i];
        await timbres.SetTimbre(element, lista_relojes.id)
        cont = cont + 1;
        console.log(cont);
        if (timbres_empleado.length === cont) {
            console.log('*************** FINAL DE INSERSION DE TIMBRES ****************');
            return { message: 'Migración de timbres realizada exitosamente', finish: false }
        }
    }
    
}


module.exports = {
    main,
    insertarTimbres,
    CrearConexionClienteFulltime27,
    CrearConexionFulltime3
}


