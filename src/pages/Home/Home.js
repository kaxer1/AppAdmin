import React from 'react';
import HomeComponent from '../../components/Home';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";

import './Home.scss';

const useStyles = makeStyles(() => ({
    titulo: {
        padding: '15px 0px',
        fontSize: '25px'
    },
}));

export default function Home(props) {
    const { handlerOpenTables, baseDatos } = props
    const classes = useStyles();

    return (
        <>
            <Typography className={classes.titulo} variant="h4" align="center" component="h5">
                BDD Disponibles Administrar
            </Typography>
            <HomeComponent handlerOpenTables={handlerOpenTables} baseDatos={baseDatos} />
        </>
    )
}