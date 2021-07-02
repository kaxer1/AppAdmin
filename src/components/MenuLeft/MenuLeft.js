import React, { useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import logoAdmin from '../../assets/png/logoAdmin.png';
import HomeIcon from '@material-ui/icons/Home';
import StorageIcon from '@material-ui/icons/Storage';
import PublicIcon from '@material-ui/icons/Public';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import BackupIcon from '@material-ui/icons/Backup';

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
            <Link to="/migracion"
                className="btn-menu"
                active={activeMenu === "/migracion" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                <ImportExportIcon /> Migración
            </Link>
            <Link to="/upload"
                className="btn-menu"
                active={activeMenu === "/upload" ? 'true' : 'false'} 
                onClick={handlerMenu}>
                <BackupIcon /> Upload
            </Link>
        </div>
    )
}

export default withRouter(MenuLeft)
