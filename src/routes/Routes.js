import React, { useEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';

// Pages
import Home from "../pages/Home";
import DataBase from "../pages/DataBase";
import AdminDB from "../pages/AdminDB";
import LicenciasAdmin from "../pages/LicenciasAdmin";
import Migracion from "../pages/Migracion";
import UploadExcel from "../pages/UploadExcel";

export default function Routes() {

    const [dataTableList, setDataTableList] = useState([]);
    const [titleDBB, settitleDBB] = useState(null)

    const handlerOpenTables = (datname) => {
        settitleDBB(datname)
        window.api.send("Api/tablasDatabase", { namedb: datname });
        window.api.receive("tablasDatabase", (data) => {
            setDataTableList(data)
        });
    }  

    const [baseDatos, setBaseDatos] = useState([])

    useEffect(() => {
        ObtenerListaBDD();
        // window.api.send("Api/usuariosDataBase");
        // window.api.receive("usuariosDataBase", (data) => {
        //     console.log(data);
        // });
        return () => {
            setBaseDatos([])
        }
    }, []);

    const ObtenerListaBDD = () => {
        window.api.send("Api/listaBDD");
        window.api.receive("listaBDD", (data) => {
            setBaseDatos(data)
        });
    }

    return (
        <Switch>
            <Route path="/" exact>
                <DataBase />
            </Route>
            <Route path="/home" exact>
                {baseDatos 
                    ? <Home handlerOpenTables={handlerOpenTables} baseDatos={baseDatos} /> 
                    : <Redirect to="/" />}
            </Route>
            <Route path="/settings" exact>
                <h1>Configuracion de cuenta</h1>
            </Route>
            <Route path="/adminDB" exact>
                {titleDBB 
                    ? <AdminDB dataTableList={dataTableList} titleDBB={titleDBB} /> 
                    : <Redirect to="/home" />}
            </Route>
            <Route path="/licencias-admin" exact>
                <LicenciasAdmin baseDatos={baseDatos} />
            </Route>
            <Route path="/migracion" exact>
                <Migracion baseDatos={baseDatos} />
            </Route>
            <Route path="/upload" exact>
                <UploadExcel />
            </Route>
        </Switch>
    )
}