import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from '../routes/Routes';
import MenuLeft from '../components/MenuLeft';
import TopBar from '../components/TopBar';

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    // flexGrow: 1,
    backgroundColor: "white",
    height: '100vh',
    margin: 0,
    color: 'black'
  },
  paper: {
    padding: theme.spacing(2),
    height: '100vh',
    color: '#114df3'
  },
  content: {
    padding: theme.spacing(2),
    height: '100vh',
    backgroundColor: "#f7f7f7",
  }
}));

export default function LoggedLayout(props) {
    const { user, logOut } = props
    const classes = useStyles();
    // console.log(user);
    return (
        <Router>
            <div className={classes.root}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Paper className={classes.paper}>
                            <MenuLeft user={user} />
                        </Paper>
                    </Grid>
                    <Grid item xs={9}>
                        <Paper className={classes.content}>
                            <TopBar logOut={logOut} />
                            <Routes />
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </Router>
    )
}
