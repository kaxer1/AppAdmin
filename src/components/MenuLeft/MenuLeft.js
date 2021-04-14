import React, { useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import logoAdmin from '../../assets/png/logoAdmin.png';
import HomeIcon from '@material-ui/icons/Home';
import SettingsIcon from '@material-ui/icons/Settings';
import StorageIcon from '@material-ui/icons/Storage';
import './MenuLeft.scss';

function MenuLeft(props) {

    const { location } = props;
    const [activeMenu, setActiveMenu] = useState(location.pathname);

    const handlerMenu = (e) => {
        console.log(e.target.attributes.href);
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
                {/* <p className="item-menu">Inicio</p> */}
            </Link>
            <Link to="/"
                className="btn-menu"
                active={activeMenu === "/" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                <StorageIcon /> BD Postgres
                {/* <p className="item-menu">BD Postgres</p> */}
            </Link>
            <Link to="/settings"
                className="btn-menu"
                active={activeMenu === "/settings" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                <SettingsIcon /> Configuración
                {/* <p className="item-menu">Configuración</p> */}
            </Link>
        </div>
    )
}

export default withRouter(MenuLeft)
