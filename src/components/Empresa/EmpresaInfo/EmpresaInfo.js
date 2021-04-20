import React from 'react';

export default function EmpresaInfo(props) {

    const { empresa } = props;    

    const renderEmpresa = () => {
        const { nombre, ruc, direccion, telefono, correo, representante, tipo_empresa } = empresa;

        return (
            <>
                <h4>Información Empresa</h4>
                <p><b>Empresa:</b> {nombre}</p>
                <p><b>Ruc:</b> {ruc}</p>
                <p><b>Direccion:</b> {direccion}</p>
                <p><b>Telefono:</b> {telefono}</p>
                <p><b>Correo:</b> {correo}</p>
                <p><b>Representante:</b> {representante}</p>
                <p><b>Entidad:</b> {tipo_empresa}</p>
            </>
        )
    }

    return (
        <div className="modulos__empre">
            {renderEmpresa()}
        </div>
    )
}
