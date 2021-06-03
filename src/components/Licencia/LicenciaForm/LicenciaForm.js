import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { SoloLetras } from '../../../utils/validacionInputs'
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: 200,
        },
    },
    btn: {
        marginTop: '10px'
    }
}));

export default function LicenciaForm(props) {
    const classes = useStyles();

    const { arrSelectListBDD, setLicencias, licencias } = props;
    const [selectList, setSelectList] = useState("")
    const [btnDisable, setBtnDisable] = useState(false)

    const [formData, setFormData] = useState(defaultValueForm());
    const [formError, setFormError] = useState({});
    const [errorMessage, setErrorMessage] = useState({});

    const onChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        const { name_database, empresa, fec_activacion, fec_desactivacion } = formData;
        if (name_database.length > 0 && empresa.length > 0 && fec_activacion.length > 0 && fec_desactivacion.length > 0 ) {
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
        setFormError({});
        setErrorMessage({});
        let errors = {};
        let message = {};
        let formOk = true;

        if (formData.name_database.length === 0) {
            errors.name_database = true;
            message.name_database = "Llenar campo obligatorio";
            formOk = false;
        }

        if (formData.empresa.length === 0) {
            errors.empresa = true;
            message.empresa = "Llenar campo obligatorio";
            formOk = false;
        }

        if (formData.fec_activacion.length === 0) {
            errors.fec_activacion = true;
            message.fec_activacion = "Llenar campo obligatorio";
            formOk = false;
        }

        if (new Date(formData.fec_desactivacion) > new Date("2050-12-31")) {
            errors.fec_desactivacion = true;
            message.fec_desactivacion = "La fecha de desactivacion sobrepasa el año 2050";
            formOk = false;
        }

        if (formData.fec_activacion > formData.fec_desactivacion) {
            errors.fec_desactivacion = true;
            message.fec_desactivacion = "La fecha de desactivación es incorrecta.";
            formOk = false;
        }

        if (formData.fec_activacion === formData.fec_desactivacion) {
            formOk = false;
            errors.fec_activacion = true;
            message.fec_activacion = "Las fechas son iguales";
            errors.fec_desactivacion = true;
            message.fec_desactivacion = "Las fechas son iguales";
        }

        setFormError(errors);
        setErrorMessage(message);

        if (formOk) {
            window.api.send("Api/createLicencia", { data: formData });
            window.api.receive("createLicencia", (data) => {
                console.log(data);
                if (!data.err) {
                    setLicencias([...licencias, data])
                    setFormData(defaultValueForm())
                    setBtnDisable(false)
                    setSelectList("")
                    toast.success('Licencia creada existosamente')
                    conexionApi(data)
                } else {
                    toast.error('Error en la creacion')
                    setBtnDisable(false)
                }
            });
            console.log('form de licencia correcto');
        } 
        e.preventDefault()
    }

    const conexionApi = (responseData) => {
        
        const credenciales = { user: "kevin", password: "1234adminApp"};

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "authorization": JSON.stringify(credenciales) },
            body: JSON.stringify(responseData)            
        };
        fetch('http://localhost:3001/licencias/createFile', requestOptions)
            .then(response => response.json())
            .then(data => toast.dark(data.message))
            .catch(err => toast.error(err.message));
    }

    return (
        <div>
            <form className={classes.root} autoComplete="off" onSubmit={onSubmit} onChange={onChange} >
                <TextField
                    id="standard-select-currency"
                    name="name_database"
                    select
                    label="Nombre BDD"
                    value={selectList}
                    onChange={handleChange}
                    error={formError.name_database}
                    helperText={errorMessage.name_database}
                    variant="outlined"
                    required
                >
                    {arrSelectListBDD.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    name="fec_activacion"
                    error={formError.fec_activacion}
                    id="date"
                    label="Fecha Activación"
                    type="date"
                    variant="outlined"
                    defaultValue={formData.fec_activacion}
                    helperText={errorMessage.fec_activacion}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />
                <TextField
                    name="fec_desactivacion"
                    error={formError.fec_desactivacion}
                    id="date"
                    label="Fecha Desactivación"
                    type="date"
                    variant="outlined"
                    value={formData.fec_desactivacion}
                    helperText={errorMessage.fec_desactivacion}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />
                <TextField
                    name="empresa"
                    error={formError.empresa}
                    onKeyPress={SoloLetras}
                    helperText={errorMessage.empresa}
                    value={formData.empresa}
                    id="outlined-helperText"
                    label="Nombre Empresa"
                    variant="outlined"
                    required
                />
                <Button className={classes.btn} type="Submit" variant="contained" color="primary" disabled={!btnDisable}>
                    Guardar licencia
                </Button>
            </form>

        </div>
    )
}

function defaultValueForm() {
    const hoy = new Date();
    return {
        name_database: "",
        empresa: "",
        fec_activacion: hoy.toJSON().split('T')[0],
        fec_desactivacion: ""
    }
}
