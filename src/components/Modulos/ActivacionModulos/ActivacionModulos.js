import React, { useState, useEffect } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { toast } from 'react-toastify';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import './ActivacionModulos.scss';

const useStyles = makeStyles({
    title: {
        color: '#22a0ff',
        fontSize: '25px'
    },
    // subtitle: {
    //     color: '#464646',
    //     fontSize: '18px'
    // },
    // btn: {
    //     margin: '10px 35%'
    // }
});

export default function ActivacionModulos(props) {
    const cls = useStyles();

    const { dataname } = props;
    // const defaultAccess = { web_access: false }

    const [modulos, setModulos] = useState(null);
    const [webAccess, setWebAccess] = useState({ web_access: false })
    const [activeWebAcces, setActiveWebAcces] = useState(false);

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
        window.api.send("Api/getAccessWebEmploy", { namedb: dataname });
        window.api.receive("getAccessWebEmploy", (data) => {
            console.log(data);
            if (data.err) {
                toast.error('Activacion sistema Empleado: ' + data.err)
                setWebAccess({ web_access: false })
                setActiveWebAcces(false)
            } else {
                setActiveWebAcces(true)
                setWebAccess(data)
            }
        });
        return () => {
            setModulos(null)
            setWebAccess(null)
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

    const renderFormModulos = () => {
        const { hora_extra, accion_personal, alimentacion, permisos, reportes } = modulos;
        // const { hora_extra, accion_personal, alimentacion, permisos, limpieza,  } = modulos;
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
                    <FormControlLabel
                        control={
                            <Switch
                                checked={reportes}
                                onChange={handleChange}
                                name="reportes"
                                color="primary" />}
                        label="Reportes"
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

    const saveAccessEmploy = (e) => {
        e.preventDefault();
        window.api.send("Api/putAccessWebEmploy", { namedb: dataname, data: webAccess });
        window.api.receive("putAccessWebEmploy", (data) => {
            console.log(data);
            setWebAccess(data)
            if (data.web_access) {
                toast.success('Acceso web del sistema para los empleados de la empresa')
            } else {
                toast.error('Sin Acceso a la aplicacion web para los empleados de la empresa')
            }
        });
    }

    const handleChangeAccessWeb = (event) => {
        setWebAccess({ [event.target.name]: event.target.checked });
    };

    const renderFormEmpleados = () => {
        const { web_access } = webAccess;
        return (
            <form onSubmit={saveAccessEmploy}>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={web_access}
                                onChange={handleChangeAccessWeb}
                                name="web_access"
                                color="primary" />}
                        label="Acceso web a empleados"
                    />
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
                </FormGroup>
            </form>
        )
    }

    const renderGrid = () => {
        return (
            <Grid container alignItems="center" >
                <Grid item sm={12} md={6}>
                    <Typography className={cls.title} align="center" component="div">
                        Habilita o Deshabilita módulos
                    </Typography>
                    {renderFormModulos()}
                </Grid>
                <Grid item sm={12} md={6}>
                    {activeWebAcces
                        ? <>
                            <Typography className={cls.title} align="center" component="div">
                                Habiliar o Deshabilita Acceso de empleados al sistema
                            </Typography>
                            {renderFormEmpleados()}
                        </>
                        : handlerErrorWebAccess()}
                </Grid>
            </Grid>
        )
    }


    const handlerError = () => {
        return (
            <h1>No existe la tabla de Funcionalidades</h1>
        )
    }

    const handlerErrorWebAccess = () => {
        return (
            <h1>No existe el campo de web_access</h1>
        )
    }

    return (
        <div className="modulos">
            {modulos ? renderGrid() : handlerError()}
        </div>
    )
}