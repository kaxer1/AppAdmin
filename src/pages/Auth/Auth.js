import React, { Component } from 'react'
import LoginForm from '../../components/LoginForm/LoginForm'
import BackgroundApp from '../../assets/jpg/businessmen.jpg';
import LogoNameWhite from '../../assets/png/logoAdmin.png';

import './Auth.scss';

export default class Auth extends Component {

    render() {
        return (
            <div className="auth" style={{ backgroundImage: `url(${ BackgroundApp })` }} >
                <div className="auth__dark" />
                <div className="auth__box">
                    <div className="auth__box-logo">
                        <img src={ LogoNameWhite } alt="logo Empresa White" />
                        <LoginForm validarUsuario={this.props.validarUsuario} />
                    </div>  
                </div> 
    
            </div>
        )
    }
}