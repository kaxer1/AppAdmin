import React, { useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import logoAdmin from '../../assets/png/logoAdmin.png';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import StorageIcon from '@material-ui/icons/Storage';
import PublicIcon from '@material-ui/icons/Public';

import './MenuLeft.scss';

function MenuLeft(props) {

    const { location } = props;
    const [activeMenu, setActiveMenu] = useState(location.pathname);

    const handlerMenu = (e) => {
        setActiveMenu(e.target.attributes.href.value)
    }  

    return (
        <div className="content">
            <img src={ logoAdmin } alt="Logo Empresa Normal" />
            <Link to="/home"
                className="btn-menu"
                active={activeMenu === "/home" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                <HomeIcon /> Inicio
            </Link>
            <Link to="/"
                className="btn-menu"
                active={activeMenu === "/" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                <StorageIcon /> BD Postgres
            </Link>
            <Link to="/licencias-admin"
                className="btn-menu"
                active={activeMenu === "/licencias-admin" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                <PublicIcon /> Licencias
            </Link>
            <Link to="/settings"
                className="btn-menu"
                active={activeMenu === "/settings" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                <SettingsIcon /> Configuración
            </Link>
        </div>
    )
}

export default withRouter(MenuLeft)
