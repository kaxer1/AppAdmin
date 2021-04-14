import React, { useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom';

// Pages
import Home from "../pages/Home";
import DataBase from "../pages/DataBase";
import Table from "../pages/Table";

export default function Routes() {

    const [dataTableList, setDataTableList] = useState([]);
    const [titleDBB, settitleDBB] = useState('postgres')

    const handlerOpenTables = (datname) => {
        settitleDBB(datname)
        window.api.send("ApiResquest", { funcion: "tablasDatabase", namedb: datname });
        window.api.receive("tablasDatabase", (data) => {
            setDataTableList(data)
        });
    }  

    const [baseDatos, setBaseDatos] = useState([])

    useEffect(() => {
        window.api.send("ApiResquest", {funcion: "listaBDD"});
        window.api.receive("listaBDD", (data) => {
            console.log(data);
            setBaseDatos(data)
        });
        // window.api.send("ApiResquest", {funcion: "usuariosDataBase"});
        // window.api.receive("usuariosDataBase", (data) => {
        //     console.log(data);
        // });
    }, []);

    return (
        <Switch>
            <Route path="/home" exact>
                <Home handlerOpenTables={handlerOpenTables} baseDatos={baseDatos} />
            </Route>
            <Route path="/" exact>
                <DataBase />
            </Route>
            <Route path="/settings" exact>
                <h1>Configuracion de cuenta</h1>
            </Route>
            <Route path="/table" exact>
                <Table dataTableList={dataTableList} titleDBB={titleDBB} />
            </Route>
        </Switch>
    )
}
