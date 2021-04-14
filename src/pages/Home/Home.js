import React from 'react';
import { Link } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

// import Table from '../Table';

import './Home.scss';

const useStyles = makeStyles((theme) => ({
    root: {
      backgroundColor: "white",
    //   color: 'black'
    },
    paper: {
      padding: theme.spacing(2),
      color: 'black',
    },
    content: {
      padding: theme.spacing(2),
      backgroundColor: "#f7f7f7",
    }
  }));

export default function Home(props) {

    const { handlerOpenTables, baseDatos } = props
    const classes = useStyles();

    const renderBaseDatos = baseDatos.map(obj => {
        return (
            <Grid item xs={4} key={obj.oid}>
                <Paper className={classes.paper}>
                    <h4>{obj.datname}</h4> 
                    <p>Tamaño {obj.pg_size_pretty} </p>
                    <Link to="/table"
                        onClick={(e) => handlerOpenTables(obj.datname)}>
                        Abrir <OpenInNewIcon/>
                    </Link>
                </Paper>
            </Grid>
        )
    })

    return (
        <>
            <h1>Home</h1>
            <Grid container spacing={2}>
                { renderBaseDatos }
            </Grid>
        </>
    )
}