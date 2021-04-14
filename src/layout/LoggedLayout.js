import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from '../routes/Routes';
import MenuLeft from '../components/MenuLeft';
import TopBar from '../components/TopBar';

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    content: {
        padding: '0px 20px',
        height: '90%',
        backgroundColor: '#f3f3f3',
    }
}));

export default function LoggedLayout(props) {
    const { user, logOut } = props;
    const classes = useStyles();

    return (
        <Router>
            <Grid container spacing={0}>
                <Grid item xs={3}>
                    <MenuLeft user={user} />
                </Grid>
                <Grid item xs={9}>
                    <TopBar logOut={logOut} />
                    <div className={classes.content}>
                        <Routes />
                    </div>
                </Grid>
            </Grid>
        </Router>
    )
}
