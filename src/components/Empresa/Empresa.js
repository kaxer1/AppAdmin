import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Grid from '@material-ui/core/Grid';

import EmpresaInfo from './EmpresaInfo';
import Empleados from './Empleados';
import Usuarios from './Usuarios';
import Sucursales from './Sucursales';

export default function Empresa(props) {

    const { dataname } = props;
    const [dataExtra, setdataExtra] = useState(null)

    useEffect(() => {
        window.api.send("Api/jsonDataEmpresa", { namedb: dataname });
        window.api.receive("jsonDataEmpresa", (data) => {
            console.log(data);
            if (data.empresa.err || data.empleados.err || data.usuarios.err || data.sucursales.err) {
                toast.error('Información Extra ' + data.empresa.err)
                setdataExtra(null)
            } else {
                setdataExtra(data)
            }
        });
        return () => {
            setdataExtra(null)
        }
    }, [dataname])

    const handlerError = () => {
        return (
            <h1>No existe la tabla de Empresa</h1>
        )
    }

    const renderComponente = () => {
        const { empleados, usuarios, empresa, sucursales } = dataExtra;
        return (
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <EmpresaInfo empresa={empresa} />
                    </Grid>
                    <Grid item sx={12} sm={3}>
                        <Empleados empleado={empleados} />
                    </Grid>
                    <Grid item sx={12} sm={3}>
                        <Usuarios usuarios={usuarios} />
                    </Grid>
                    <Grid item sx={12} sm={12}>
                        <Sucursales sucursales={sucursales} />
                    </Grid>
                </Grid>
            </>
        )
    }

    return (
        <div>
            {dataExtra ? renderComponente() : handlerError()}
        </div>
    )
}
