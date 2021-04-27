import React, { useState, useEffect } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { toast } from 'react-toastify';

import './ActivacionModulos.scss';
import Grid from '@material-ui/core/Grid';

export default function ActivacionModulos(props) {

    const { dataname } = props;

    const [modulos, setModulos] = useState(null)

    useEffect(() => {
        window.api.send("Api/getfuncionesModulos", { namedb: dataname });
        window.api.receive("getfuncionesModulos", (data) => {
            console.log(data);
            if (data.err) {
                toast.error('Activacion Modulos: ' + data.err)
                setModulos(null)
            } else {
                setModulos(data)
            }
        });
        return () => {
            setModulos(null)
        }
    }, [dataname])

    const handleChange = (event) => {
        setModulos({ ...modulos, [event.target.name]: event.target.checked });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        window.api.send("Api/putfuncionesModulos", { namedb: dataname, data: modulos });
        window.api.receive("putfuncionesModulos", (data) => {
            setModulos(data)
            toast.success('Modulos Actualizados')
        });
    }

    const renderForm = () => {
        const { hora_extra, accion_personal, alimentacion, permisos } = modulos;
        return (
            <form onSubmit={onSubmit}>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={hora_extra}
                                onChange={handleChange}
                                name="hora_extra"
                                color="primary" />}
                        label="Horas Extras"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={accion_personal}
                                onChange={handleChange}
                                name="accion_personal"
                                color="primary" />}
                        label="Acciones de personal"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={alimentacion}
                                onChange={handleChange}
                                name="alimentacion"
                                color="primary" />}
                        label="Alimentacion"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={permisos}
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
    }

    const handlerError = () => {
        return (
            <h1>No existe la tabla de Funcionalidades</h1>
        )
    }

    const renderGrid = () => {
        return (
            <Grid container alignItems="center" >
                <Grid item sm={12} md={6}>
                    <h4>Habilita o Deshabilita módulos</h4>
                    {renderForm()}
                </Grid>
                <Grid item sm={12} md={6}>
                    <h1>Hola</h1>
                </Grid>
            </Grid>
        )
    }

    return (
        <div className="modulos">
            {modulos ? renderGrid() : handlerError()}
        </div>
    )
}