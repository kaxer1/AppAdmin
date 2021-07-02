import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

export default function DialogApp(props) {

    const { closeDialogApp, open, empleado: { app_habilita, cedula, codigo, fullname, usuario } } = props

    const [valueApp, setvalueApp] = useState(app_habilita)

    const handleChange = (event) => {
        setvalueApp(event.target.checked);
    };

    return (
        <Dialog open={open} onClose={() => closeDialogApp(null)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Reloj Virtual</DialogTitle>
            <DialogContent dividers>
                <Typography variant="body1" align="left">
                    Empleado: {fullname} 
                </Typography>
                <Typography variant="body1" align="left">
                    Usuario: {usuario} 
                </Typography>
                <Typography variant="body1" align="left">
                    Código: {codigo} 
                </Typography>
                <Typography variant="body1" align="left">
                    Cédula: {cedula} 
                </Typography>
                <form>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={valueApp}
                                    onChange={handleChange}
                                    name="app_habilita"
                                    color="primary" />}
                            label="App Reloj Virtual"
                        />
                    </FormGroup>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => closeDialogApp(null)} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => closeDialogApp(valueApp)} color="secondary">
                    Guardar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
