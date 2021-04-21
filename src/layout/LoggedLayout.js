import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from '../routes/Routes';
import MenuLeft from '../components/MenuLeft';
import TopBar from '../components/TopBar';

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    menu: {
        width: '250px',
    },
    sub_content: {
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
                <Grid item xs={4} sm={3} md={3} lg={2}>
                    <MenuLeft user={user} />
                </Grid>
                <Grid item xs={8} sm={9} md={9} lg={10}>
                    <TopBar logOut={logOut} />
                    <div className={classes.sub_content}>
                        <Routes />
                    </div>
                </Grid>
            </Grid>
        </Router>
    )
}
