import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import EmpresaInfo from './EmpresaInfo';
import Empleados from './Empleados';

export default function Empresa(props) {

    const { dataname } = props;
    // const [empresa, setEmpresa] = useState(null);
    const [dataExtra, setdataExtra] = useState(null)
    
    useEffect(() => {
        // getEmpresaInfo();
        getDataExtraEmpresa();
        return () => {
            setdataExtra(null)
        }
    }, [])

    const getDataExtraEmpresa = () => {
        window.api.send("Api/jsonDataEmpresa", { namedb: dataname });
        window.api.receive("jsonDataEmpresa", (data) => {
            console.log(data);
            if (data.err) {
                toast.error('Información Extra ' + data.err)
                setdataExtra(null)
            } else {
                setdataExtra(data)
            }
        });
    }

    // const getEmpresaInfo = () => {
    //     window.api.send("Api/getEmpresaInfo", { namedb: dataname });
    //     window.api.receive("getEmpresaInfo", (data) => {
    //         console.log(data);
    //         if (data.err) {
    //             toast.error('Empresa Info: ' + data.err)
    //             setEmpresa(null)
    //         } else {
    //             setEmpresa(data)
    //         }
    //     });
    // }

    const handlerError = () => {
        return (
            <h1>No existe la tabla de Empresa</h1>
        )
    }

    const renderComponente = () => {
        const { empleados, usuarios, empresa } = dataExtra;
        console.log(usuarios);
        return (
            <>
                <EmpresaInfo empresa={empresa} />
                <Empleados empleado={empleados} />
            </>
        )
    }

    return (
        <div>
            {dataExtra ? renderComponente() : handlerError()}
        </div>
    )
}
