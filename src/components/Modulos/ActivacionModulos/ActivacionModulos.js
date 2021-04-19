import React, { useState, useEffect } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { toast } from 'react-toastify';

import './ActivacionModulos.scss';
import EmpresaInfo from './EmpresaInfo';
import Grid from '@material-ui/core/Grid';

export default function ActivacionModulos(props) {

    const { dataname } = props;

    const [modulos, setModulos] = useState({
        hora_extra: false,
        accion_personal: false,
        alimentacion: false,
        permisos: false,
    })

    useEffect(() => {
        window.api.send("ApiResquest", { funcion: "getfuncionesModulos", namedb: dataname });
        window.api.receive("getfuncionesModulos", (data) => {
            setModulos(data)
        });
    }, [])

    const handleChange = (event) => {
        setModulos({ ...modulos, [event.target.name]: event.target.checked });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        window.api.send("ApiResquest", { funcion: "putfuncionesModulos", namedb: dataname, data: modulos });
        window.api.receive("putfuncionesModulos", (data) => {
            setModulos(data)
            toast.success('Modulos Actualizados')
        });
    }

    const renderForm = (
        <form onSubmit={onSubmit}>
            <FormGroup row>
                <FormControlLabel
                    control={
                        <Switch
                            checked={modulos.hora_extra}
                            onChange={handleChange}
                            name="hora_extra"
                            color="primary" />}
                    label="Horas Extras"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={modulos.accion_personal}
                            onChange={handleChange}
                            name="accion_personal"
                            color="primary" />}
                    label="Acciones de personal"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={modulos.alimentacion}
                            onChange={handleChange}
                            name="alimentacion"
                            color="primary" />}
                    label="Alimentacion"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={modulos.permisos}
                            onChange={handleChange}
                            name="permisos"
                            color="primary" />}
                    label="Permisos"
                />
            </FormGroup>
            <div className="btn-content">
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                    className="btn-save"
                    endIcon={<SaveIcon />}
                >Guardar</Button>
            </div>
        </form>
    )

    const handlerComparacion = () => {
        toast.error(modulos.err)
    }

    return (
        <div className="modulos">
            <Grid container alignItems="center" >
                <Grid item sm={12} md={6}>
                    <h4>Habilita o Deshabilita módulos</h4>
                    {modulos.err ? handlerComparacion() : renderForm}
                </Grid>
                <Grid item sm={12} md={6}>
                    <h4>Información Empresa</h4>
                    <EmpresaInfo dataname={dataname} />
                </Grid>
            </Grid>
        </div>
    )
}