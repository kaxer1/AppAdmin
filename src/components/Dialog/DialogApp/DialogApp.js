import React, { useState } from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

export default function DialogApp(props) {

    const { closeDialogApp, open, empleado: { app_habilita, cedula, codigo, fullname, id_user, usuario } } = props

    const [valueApp, setvalueApp] = useState(app_habilita)

    const handleChange = (event) => {
        setvalueApp(event.target.checked);
    };

    return (
        <Dialog open={open} onClose={() => closeDialogApp(null)} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Reloj Virtual</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {cedula}
                    {codigo}
                    {fullname}
                    {id_user}
                    {usuario}
                </DialogContentText>
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
