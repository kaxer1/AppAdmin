import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme) => ({
    topbar: {
        top: 0,
        left: 0,
    },
    grow: {
        flexGrow: 1,
    }
}));

export default function TopBar(props) {

    const { logOut } = props;
    const classes = useStyles();
  
    const handleLogOut = () => {
        logOut()
    }
  
    return (
      <div className={classes.topbar}>
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Administración
                </Typography>
                <div className={classes.grow} />
                <div>
                    <IconButton aria-label="cerrar sesión" color="inherit" onClick={handleLogOut}>
                        <ExitToAppIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
      </div>
    );
}
