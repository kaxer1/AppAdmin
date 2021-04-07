import React, { Component } from 'react'
import keys from '../../sample/keys.json'
import LoginForm from '../../components/Auth/LoginForm'
import BackgroundApp from '../../assets/jpg/businessmen.jpg';
import LogoNameWhite from '../../assets/png/LOGOBLFT.png';

import './Auth.scss';

export default class Auth extends Component {

    state = {
        keys: keys
    }

    validarUsuario = (username, password) => {
        const [ obj ] = this.state.keys;

        const newLoggin = {
            id: obj.intentos.length,
            username: username,
            password: password,
            create_at: new Date()
        }
        console.log(newLoggin);

        this.setState({
            keys: [
                { 
                    id: obj.id,
                    username: obj.username,
                    password: obj.password,
                    intentos: [...obj.intentos, newLoggin] 
                }
            ]
        })

        if ( obj.username === username && obj.password === password ) {
            console.log('INGRESO AL SISTEMA');
        } else {
            console.warn('No ingresio a sesion');
        }
       

    }

    render() {
        return (
            <div className="auth" style={{ backgroundImage: `url(${ BackgroundApp })` }} >
                <div className="auth__dark" />
                <div className="auth__box">
                    <div className="auth__box-logo">
                        <img src={ LogoNameWhite } alt="Musicfy" />
                        <LoginForm validarUsuario={this.validarUsuario} />
                    </div>  
                </div> 
    
            </div>
        )
    }
}