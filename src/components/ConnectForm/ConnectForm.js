import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';

import './ConnectForm.scss';

export default class ConnectForm extends Component {
    constructor(props) {
        super(props);
        const { dataConnect: [ dataForm ] } = this.props;
        this.state = {
            database: dataForm.database,
            host: dataForm.host,
            password: dataForm.password,
            port: dataForm.port,
            user: dataForm.user
        };
    }

    render() {

        const { database, host, password, port, user } = this.state

        const onSubmit = (e) => {
            e.preventDefault();
            this.props.handlerSaveConnect(this.state)
        }

        const onChange = (e) => {
            this.setState({ 
                [e.target.name]: e.target.value 
            })
        }

        return (
            <div className="connect">
                <p className="title">Actualizar Conexión</p>
                <form onSubmit={onSubmit} onChange={onChange} noValidate autoComplete="off" className="connect__form">
                    <TextField id="outlined-full-width" label="Base de Datos" variant="outlined" fullWidth margin="normal"
                        type="text"
                        name="database"
                        value={database} />
                    <TextField id="outlined-full-width" label="Host" variant="outlined" fullWidth margin="normal"
                        type="text"
                        name="host"
                        value={host} />
                    <TextField id="outlined-full-width" label="Port" variant="outlined" fullWidth margin="normal"
                        type="text"
                        name="port"
                        value={port} />
                    <TextField id="outlined-full-width" label="Usuario" variant="outlined" fullWidth margin="normal"
                        type="text"
                        name="user"
                        value={user} />
                    <TextField id="outlined-full-width" label="Contraseña" variant="outlined" fullWidth margin="normal"
                        type="password"
                        name="password"
                        value={password} />
                    <Button 
                        type="submit" 
                        id="btn" 
                        variant="contained"
                        endIcon={<SaveIcon/>} 
                        color="primary"> Guardar Conexión </Button>
                </form>
            </div>
        )
    }
}
