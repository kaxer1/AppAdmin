import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import BackupIcon from '@material-ui/icons/Backup';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles((theme) => ({
    btn: {
        marginTop: '10px'
    },
    icon_succ: {
        color: '#00F520',
        fontSize: '100px',
        alignItems: 'center'
    },
    icon_err: {
        color: '#ff2727',
        fontSize: '100px',
        alignItems: 'center'
    },
    subtitulo: {
        paddingBottom: '7px',
        fontSize: '18px',
        color: theme.palette.text.primary
    },
    root: {
        minWidth: 275,
    },
}));

export default function ExpDataFlex(props) {

    const classes = useStyles()
    console.log(props);
    const { optionsQueryFT3, campos: { id, metodo_name, importarExcel, handlerChange } } = props;
    const [path, setPath] = useState('');
    const [activeBtn, setActiveBtn] = useState(false);
    const [migrado, setMigrado] = useState(false);
    const [progress, setProgress] = useState(false);
    const [activeForm, setActiveForm] = useState(true);
    const [showMessageMigration, setShowMessageMigration] = useState(false);

    const resetUseState = () => {
        setPath('')
        setActiveBtn(false)
    }

    const renderSuccessMigracion = (
        <>
            <CheckCircleIcon className={classes.icon_succ} />
            <Typography className={classes.subtitulo} variant="h4" align="center" component="h5">
                Migración exitosa
            </Typography>
        </>
    )

    const renderErrorMigracion = (
        <>
            <ErrorIcon className={classes.icon_err} />
            <Typography className={classes.subtitulo} variant="h4" align="center" component="h5">
                Migración fallida
            </Typography>
            <Button
                className={classes.btn}
                onClick={(e) => { setActiveForm(true); setShowMessageMigration(false) }}
                variant="contained"
                startIcon={<ArrowBackIcon />}
                color="primary">
                Nuevo intento
            </Button>
        </>
    )

    const messageMigracion = (
        <>
            {migrado ? renderSuccessMigracion : renderErrorMigracion}
        </>
    )

    const formFile = (
        <form method="post">
            <TextField
                fullWidth
                type="file"
                name="files"
                onChange={(e) => { handlerChange(e, setActiveBtn, setPath, resetUseState) }}
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                id="outlined-basic"
                variant="outlined" />
            <Button
                className={classes.btn}
                onClick={(e) => { importarExcel(metodo_name, path, optionsQueryFT3, setMigrado, setProgress, setShowMessageMigration); 
                    setActiveForm(false) }}
                variant="contained"
                endIcon={<BackupIcon />}
                disabled={!activeBtn}
                color="primary">
                Upload
            </Button>
        </form>
    )

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h6" gutterBottom component="div">
                    Paso {id} Subir {metodo_name}
                </Typography>
                { activeForm && formFile}
                { progress && <CircularProgress disableShrink /> }
                { showMessageMigration && messageMigracion}
            </CardContent>
        </Card>
    )
}
