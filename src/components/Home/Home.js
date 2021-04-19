import React from 'react';
import { Link } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

import './Home.scss';

export default function Home(props) {
    const { handlerOpenTables, baseDatos } = props

    const renderBaseDatos = baseDatos.map(obj => {
        return (
            <Grid item xs={4} key={obj.oid}>
                <Paper className="cards">
                    <p className="cards__titulo">{obj.datname}</p> 
                    <p className="cards__size">Tamaño {obj.pg_size_pretty} </p>
                    <Link to="/adminDB" className="cards__btn-link"
                        onClick={(e) => handlerOpenTables(obj.datname)}>
                            <p className="text"> Abrir </p>
                            <OpenInNewIcon />
                    </Link>
                </Paper>
            </Grid>
        )
    })

    return (
        <>
            <Grid container spacing={2}>
                { renderBaseDatos }
            </Grid>
        </>
    )
}
