import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import BlockIcon from '@material-ui/icons/Block';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { SoloNumeros } from '../../../utils/validacionInputs'
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
    btn: {
        marginTop: '10px',
        width: 200
    },
    icon: {
        color: '#00F520',
        fontSize: '100px',
        alignItems: 'center'
    },
    subtitulo: {
        paddingBottom: '7px',
        fontSize: '18px',
        color: theme.palette.text.primary
    },
    parrafo: {
        paddingBottom: '5px',
        fontSize: '15px',
    }
}));

export default function FormFulltime3(props) {
    const { baseDatos: arrSelectListBDD, setOptionsQueryFT3, optionsQueryFT3} = props
    const classes = useStyles();

    const [selectList, setSelectList] = useState("")
    const [btnDisable, setBtnDisable] = useState(false)

    const [formData, setFormData] = useState(defaultValueForm());
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState({});
    const [successConnection, setSuccessConnection] = useState(false);

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        const { host, port, user, password } = formData;
        if ( host.length > 0 && port.length > 0 && user.length > 0 && password.length > 0 ) {
            console.log(btnDisable);
            setBtnDisable(true)
        }
    }

    const handleChange = (e) => {
        setSelectList(e.target.value);
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const onSubmit = (e) => {
        e.preventDefault()
        setFormError({});
        setErrorMessage({});
        let errors = {};
        let message = {};
        let formOk = true;

        if (formData.datname.length === 0) {
            errors.datname = true;
            message.datname = "Llenar campo obligatorio";
            formOk = false;
        }

        if (formData.host.length === 0) {
            errors.host = true;
            message.host = "Llenar campo obligatorio";
            formOk = false;
        }

        if (formData.port.length === 0) {
            errors.port = true;
            message.port = "Llenar campo obligatorio";
            formOk = false;
        }

        if (formData.user.length === 0) {
            errors.user = true;
            message.user = "Llenar campo obligatorio";
            formOk = false;
        }

        if (formData.password.length === 0) {
            errors.password = true;
            message.password = "Llenar campo obligatorio";
            formOk = false;
        }

        setFormError(errors);
        setErrorMessage(message);

        if (formOk) {
            window.api.send("Api/CrearConexionFulltime3", { data: formData });
            window.api.receive("CrearConexionFulltime3", (data) => {
                console.log(data);
                if (!data.err) {
                    setOptionsQueryFT3( data )
                    setFormData(defaultValueForm())
                    setBtnDisable(false)
                    setSelectList("")
                    toast.success('Conexión exitosa')
                    setSuccessConnection(true)
                } else {
                    toast.error('Error en la creación de conexión')
                    setBtnDisable(false)
                    setSuccessConnection(false)
                }
            });
            console.log('form de Conexion fulltime V3 correcto');
        } 
    }

    const renderForm = (
        <div className={classes.root}>
            <form autoComplete="off" onSubmit={onSubmit} onChange={onChange} >
                <TextField
                    id="standard-select-currency"
                    name="datname"
                    select
                    label="Nombre BDD"
                    value={selectList}
                    onChange={handleChange}
                    error={formError.datname}
                    helperText={errorMessage.datname}
                    variant="outlined"
                    required
                >
                    {arrSelectListBDD.map((option) => (
                        <MenuItem key={option.oid} value={option.datname}>
                            {option.datname}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    name="host"
                    error={formError.host}
                    helperText={errorMessage.host}
                    value={formData.host}
                    id="outlined-helperText"
                    label="Host"
                    variant="outlined"
                    required
                />
                <TextField
                    name="port"
                    error={formError.port}
                    onKeyPress={SoloNumeros}
                    helperText={errorMessage.port}
                    value={formData.port}
                    id="outlined-helperText"
                    label="Port"
                    variant="outlined"
                    required
                />
                <TextField
                    name="user"
                    error={formError.user}
                    helperText={errorMessage.user}
                    value={formData.user}
                    id="outlined-helperText"
                    label="Usuario"
                    variant="outlined"
                    required
                />
                <TextField
                    name="password"
                    type="password"
                    error={formError.password}
                    helperText={errorMessage.password}
                    value={formData.password}
                    id="outlined-helperText"
                    label="Contraseña"
                    variant="outlined"
                    required
                />
                <Button className={classes.btn} type="Submit" variant="contained" color="primary" disabled={!btnDisable}>
                    Guardar
                </Button>
            </form>
        </div>
    )

    const renderSuccessConnection = () => {
        const { database, host, port, user } = optionsQueryFT3;
        return (
            <>
                <CheckCircleIcon className={classes.icon} />
                <Typography className={classes.subtitulo} variant="h4" align="center" component="h5">
                    Conexion exitosa
                </Typography>
                <Typography className={classes.parrafo} variant="h4" align="left" component="h5">
                    Host: { host } <br/>
                    Port: { port } <br/>
                    User: { user } <br/>
                    Dataname: { database }
                </Typography>
                <Button 
                    className={classes.btn} 
                    variant="contained" 
                    color="primary"  
                    onClick={() => { setSuccessConnection(false); setOptionsQueryFT3({}) }}
                    endIcon={<BlockIcon />}>
                    Desconectar
                </Button>
            </>
        )
    }

    return (
        <> {successConnection ? renderSuccessConnection() : renderForm}
        </>
    )
}

function defaultValueForm() {
    return {
        datname: "",
        host: "",
        port: "",
        user: "",
        password: ""
    }
}