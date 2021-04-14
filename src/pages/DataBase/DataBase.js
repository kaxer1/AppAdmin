import React from 'react';
import Button from '@material-ui/core/Button';
import StorageIcon from '@material-ui/icons/Storage';
import SaveIcon from '@material-ui/icons/Save';

import './DataBase.scss';

export default function DataBase() {

    const cred_BDD = [{
        user: 'postgres',
        host: 'localhost',
        port: 5432,
        database: 'SinAcciones',
        password: 'fulltime'
    }];

    const handlerConnectUser = () => {
        window.api.send("ArchivoConf", { data: { accion: "read_update"} });
        window.api.receive("read_update", (data) => {
            console.log(data);
        });
    };

    const handlerSaveConnect = () => {
        window.api.send("ArchivoConf", { data: { accion: "update", data: JSON.stringify(cred_BDD) } });
        window.api.receive("update", (data) => {
            console.log(data);
        });
    }

    return (
        <div>
            <h1>Conectate al usuario de Postgresql</h1>
            <Button 
                variant="contained" 
                color="primary"
                size="large"
                onClick={handlerConnectUser}
                endIcon={<StorageIcon/>}
                >Conectar </Button>
            <Button 
                variant="contained" 
                color="secondary"
                size="large"
                onClick={handlerSaveConnect}
                endIcon={<SaveIcon/>}
                >Guardar </Button>
        </div>
    )
}
