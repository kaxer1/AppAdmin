import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import Button from '@material-ui/core/Button';
import StorageIcon from '@material-ui/icons/Storage';
import ClearIcon from '@material-ui/icons/Clear';
import ConnectForm from '../../components/ConnectForm';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";

import './DataBase.scss';

const useStyles = makeStyles(() => ({
    titulo: {
        padding: '15px 0px',
        fontSize: '25px'
    },
}));

export default function DataBase() {

    const [activeForm, setActiveForm] = useState(false);
    const [dataConnect, setdataConnect] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        window.api.send("fileConf/read_update");
        window.api.receive("read_update", (data) => {
            console.log(JSON.parse(data));
            setdataConnect(JSON.parse(data))
        });
    }, [])

    const handlerConnectUser = () => {
        setActiveForm(true);
    };

    const handlerSaveConnect = (data) => {
        console.log(data);
        window.api.send("fileConf/update", { data: JSON.stringify([data]) });
        window.api.receive("update", (data) => {
            console.log(data);
            setActiveForm(false)
            setdataConnect(JSON.parse(data))
            toast.success('Conexión actualizada')
        });
    }

    const handlerCancel = () => {
        setActiveForm(false);
        setdataConnect(dataConnect)
    }

    const renderData = dataConnect.map(o => {
        return (
            <div key={1}>
                <p>Base de Datos: {o.database} </p>
                <p>Host: {o.host} </p>
                <p>Port: {o.port} </p>
                <p>Usuario: {o.user} </p>
            </div>
        )
    })
    return (
        <>
            <Typography className={classes.titulo} variant="h4" align="center" component="h5">
                Conectate al SGBD Postgresql
            </Typography>
            {renderData}
            <div className="btn-group">
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
                    onClick={handlerCancel}
                    endIcon={<ClearIcon/>}
                    >Cancelar </Button>
            </div>
            { activeForm && <ConnectForm dataConnect={dataConnect} handlerSaveConnect={handlerSaveConnect} />  }
        </>
    )
}
