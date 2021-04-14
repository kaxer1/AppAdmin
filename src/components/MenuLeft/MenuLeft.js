import React, { useState } from 'react';
import { Link, withRouter } from "react-router-dom";

import './MenuLeft.scss';

function MenuLeft(props) {

    const { location } = props;
    const [activeMenu, setActiveMenu] = useState(location.pathname);

    const handlerMenu = (e) => {
        setActiveMenu(e.target.attributes.href.value)
    }  

    return (
        <>
            <Link to="/home"
                className="btn-menu"
                active={activeMenu === "/home" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                Home
            </Link>
            <Link to="/"
                className="btn-menu"
                active={activeMenu === "/" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                Base de Datos
            </Link>
            <Link to="/settings"
                className="btn-menu"
                active={activeMenu === "/settings" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                Configuración
            </Link>
        </>
    )
}

export default withRouter(MenuLeft)
