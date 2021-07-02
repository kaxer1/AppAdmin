import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from '../routes/Routes';
import MenuLeft from '../components/MenuLeft';
import TopBar from '../components/TopBar';

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
    root: {
        minHeight: '100vh',
        "&:first-of-type": {
            height: '95vh'
        },

        "&:last-of-type": {
            height: '5vh'
        }
    },
    rootContent: {
        minHeight: '90vh',
        "&:first-of-type": {
            height: '5vh'
        },

        "&:last-of-type": {
            height: '85vh',
        },
    },
    menu: {
        width: '250px',
    },
    sub_content: {
        padding: '0px 20px 20px 20px',
        marginTop: '15px',
        backgroundColor: '#f3f3f3'
    },
    foother: {
        backgroundColor: '#006DB6',
        color: '#FFFFFF'
    },
    itemFoother: {
        marginTop: '20px',
        marginLeft: '10px',
        fontSize: '15px'
    }
}));

export default function LoggedLayout(props) {
    const { user, logOut } = props;
    const classes = useStyles();

    return (
        <Router>
            <Grid className={classes.root} container spacing={0}>
                <Grid item xs={4} sm={3} md={3} lg={2}>
                    <MenuLeft user={user} />
                </Grid>
                <Grid className={classes.rootContent} item xs={8} sm={9} md={9} lg={10}>
                    <TopBar logOut={logOut} />
                    <div className={classes.sub_content}>
                        <Routes />
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} className={classes.foother}>
                    <Typography className={classes.itemFoother} align="left" variant="h5" >
                        Desarrollado por Casa Pazmiño
                    </Typography>
                </Grid>
            </Grid>
        </Router>
    )
}