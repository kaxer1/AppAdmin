import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import BackupIcon from '@material-ui/icons/Backup';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';

const useStyles = makeStyles({
    btn: {
        marginTop: '10px'
    },
});

export default function Upload(props) {

    const { name_database } = props;
    const classes = useStyles()

    const [path, setPath] = useState('');
    const [activeBtn, setActiveBtn] = useState(false)
    
    const handlerChange = e => {
        if (e.target.files[0] !== undefined) {
            const { path, name } = e.target.files[0];

            if (name === 'PLANTILLA DATOS.xlsx') {
                console.log(e.target.files[0]);
                setPath(path)
                setActiveBtn(true)   
            } else {
                toast.error('Nombre de archivo incorrecto. Renombrar a PLANTILLA DATOS.xlsx')
                resetUseState();
            }
        } else {
            resetUseState();
        }
    }

    const resetUseState = () => {
        setPath('')
        setActiveBtn(false)  
    }

    const submitFile = () => {
        window.api.send("Api/fileUpload", { path, name_database });
        window.api.receive("fileUpload", (data) => {
            console.log(data);
            const { message , empresa, sucursal, cargo, departamento, empleados } = data

            if (message) {
                toast.dark(message)
            }

            if (empresa) {
                if (!empresa.err) {
                    toast.success(empresa.message)
                } else {
                    toast.error('ERROR HOJA EMPRESA. ' + empresa.err)
                }
            }
            
            if (sucursal) {
                if (!sucursal.err) {
                    toast.success(sucursal.message)
                } else {
                    toast.error('ERROR HOJA SUCURSAL. ' + sucursal.err)
                }
            }

            if (cargo) {
                if (!cargo.err) {
                    toast.success(cargo.message)
                } else {
                    toast.error('ERROR HOJA CARGO. ' + cargo.err)
                }
            }
            
            if (departamento) {
                if (!departamento.err) {
                    toast.success(departamento.message)
                } else {
                    toast.error('ERROR HOJA DEPARTAMENTOS. ' + departamento.err)
                }
            }

            if (empleados) {
                if (!empleados.err) {
                    toast.success(empleados.message)
                } else {
                    toast.error('ERROR HOJA EMPLEADOS. ' + empleados.err)
                }
            }

        })
    }

    return (
        <div>
            <form method="post">
                <TextField 
                    fullWidth
                    type="file" 
                    name="files" 
                    onChange={handlerChange} 
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    id="outlined-basic"  
                    variant="outlined" />
                <Button 
                    className={classes.btn}
                    onClick={submitFile} 
                    variant="contained" 
                    endIcon={<BackupIcon />}
                    disabled={!activeBtn}
                    color="primary">
                    Upload
                </Button>
            </form>
        </div>
    )
}
