import React, { useState } from 'react';

import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Grid from '@material-ui/core/Grid';

import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    btn: {
        marginTop: '10px',
        width: 200
    },
    icon: {
        color: '#00F520',
        fontSize: '100px',
        alignItems: 'center'
    },
    subtitulo: {
        paddingBottom: '7px',
        fontSize: '18px',
        color: theme.palette.text.primary
    },
}));

export default function ConexionFT3FT27(props) {
    const classes = useStyles();

    const { fulltime3, fulltime2_7 } = props;
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [compliteEmploy, setcompliteEmploy] = useState(true);
    const [compliteTimbres, setcompliteTimbres] = useState(true)


    const handlerStartMigracionEmploy = () => {
        console.log(fulltime3, fulltime2_7);
        setLoading(true)

        window.api.send("Api/migracionFT3__FT2_7", { fulltime3, fulltime2_7 });
        window.api.receive("migracionFT3__FT2_7", (data) => {
            console.log(data);
            if (!data.err) {
                toast.success(data.message)
                setLoading(data.finish)
                setSuccess(true);
                setcompliteEmploy(false)
            } else {
                toast.error('Error en la migracion')
                setSuccess(false)
                setLoading(false)
                setcompliteEmploy(true)
            }
        });
    }

    const handlerStartMigracionTimbres = () => {
        console.log(fulltime3, fulltime2_7);
        setLoading(true)

        window.api.send("Api/migracionFT3__FT2_7_Timbre", { fulltime3, fulltime2_7 });
        window.api.receive("migracionFT3__FT2_7_Timbre", (data) => {
            console.log(data);
            if (!data.err) {
                toast.success(data.message)
                setLoading(data.finish)
                setSuccess(true)
                setcompliteTimbres(false)
            } else {
                toast.error('Error en la migracion')
                setSuccess(false)
                setLoading(false)
                setcompliteTimbres(true)
            }
        });
    }

    const renderSuccessMigration = (
        <Paper className={classes.paper} >
            <CheckCircleIcon className={classes.icon} />
            <Typography className={classes.subtitulo} variant="h4" align="center" component="h5">
                Migración completada con exito.
            </Typography>
            <Button
                className={classes.btn}
                type="Submit"
                variant="contained"
                startIcon={<ArrowBackIcon />}
                color="primary"
                onClick={() => { setLoading(false); setSuccess(false) }}>
                Atrás
            </Button>
        </Paper>
    )

    const renderProgress = (
        <>
            <div className={classes.root}>
                <LinearProgress />
            </div> <br />
            <Typography variant="h4" align="center" component="h5">
                Procesando...
            </Typography>
        </>
    )

    const renderStartMigration = (
        <Paper className={classes.paper} >
            <Typography variant="h3" align="center" component="h3">
                Conexión establecida
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    { compliteEmploy &&
                        <>
                            <Typography variant="h5" align="center" component="h5">
                                Migración de empleados
                            </Typography>
                            <Button
                                className={classes.btn}
                                type="Submit"
                                variant="contained"
                                endIcon={<PlayArrowIcon />}
                                color="primary"
                                onClick={handlerStartMigracionEmploy}>
                                Iniciar
                            </Button>
                        </>
                    }
                </Grid>
                <Grid item xs={6}>
                    { compliteTimbres &&
                        <>
                            <Typography variant="h5" align="center" component="h5">
                                Migración de timbres
                            </Typography>
                            <Button
                                className={classes.btn}
                                type="Submit"
                                variant="contained"
                                endIcon={<PlayArrowIcon />}
                                color="primary"
                                onClick={handlerStartMigracionTimbres}>
                                Iniciar
                            </Button>
                        </>
                    }
                </Grid>
            </Grid>
        </Paper>
    )
    return (
        <>
            { success
                ? renderSuccessMigration
                : loading ? renderProgress : renderStartMigration
            }
        </>
    )
}
