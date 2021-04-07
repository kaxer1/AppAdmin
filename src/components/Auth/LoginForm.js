import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import './LoginForm.scss';

export default class LoginForm extends Component {
    
    state = {
        username: '',
        password: ''
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.validarUsuario(this.state.username.trim(), this.state.password.trim())
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value.trim()
        })
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}  noValidate autoComplete="off" >
                <TextField id="outlined-full-width" label="Usuario" variant="outlined" fullWidth
          margin="normal"
                    type="text" 
                    name="username"
                    onChange={this.onChange} 
                    value={this.state.username} />
                <TextField id="outlined-full-width" label="Contraseña" variant="outlined" fullWidth
          margin="normal"
                    type="password" 
                    name="password"
                    onChange={this.onChange} 
                    value={this.state.password} />
                <Button id="btn" variant="contained" color="primary"> INGRESAR </Button>
            </form>
        )
    }
}
