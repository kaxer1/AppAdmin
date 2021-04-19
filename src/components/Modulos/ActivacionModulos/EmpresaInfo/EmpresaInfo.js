import React, { useState, useEffect} from 'react';
import { toast } from 'react-toastify';

export default function EmpresaInfo(props) {

    const { dataname } = props;

    const [empresa, setEmpresa] = useState({
        nombre: "", 
        ruc: "", 
        direccion: "", 
        telefono: "", 
        correo: "", 
        representante: "", 
        tipo_empresa: ""
    })

    const { nombre, ruc, direccion, telefono, correo, representante, tipo_empresa } = empresa
    useEffect(() => {
        window.api.send("ApiResquest", { funcion: "getEmpresaInfo", namedb: dataname });
        window.api.receive("getEmpresaInfo", (data) => {
            setEmpresa(data)
        });
    }, [])
    const renderEmpresa = (
        <>
            <p><b>Empresa:</b> { nombre}</p>
            <p><b>Ruc:</b> { ruc}</p>
            <p><b>Direccion:</b> { direccion}</p>
            <p><b>Telefono:</b> { telefono}</p>
            <p><b>Correo:</b> { correo}</p>
            <p><b>Representante:</b> { representante}</p>
            <p><b>Entidad:</b> { tipo_empresa}</p>
        </>
    )

    const handlerComparacion = () => {
        toast.error(empresa.err)
    }

    return (
        <div className="modulos__empre">
            {empresa.err ? handlerComparacion() : renderEmpresa}
        </div>
    )
}
