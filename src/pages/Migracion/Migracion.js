import React, { useState } from 'react';

import FormFulltime27 from '../../components/Migracion/FormFulltime2_7';
import FormFulltime3 from '../../components/Migracion/FormFulltime3';
import ConexionFT3FT27 from '../../components/Migracion/ConexionFT3_FT27';
import ExpDataFlex from '../../components/Migracion/ExpDataFlex';
import DialogFulltime27 from '../../components/Dialog/DialogFulltime2_7'
import DialogDataflex from '../../components/Dialog/DialogDataflex'

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';

import { camposExp } from './metodosImportar';

const useStyles = makeStyles((theme) => ({
    titulo: {
        padding: '5px 0px',
        fontSize: '25px'
    },
    subtitulo: {
        paddingBottom: '10px',
        fontSize: '18px',
        color: theme.palette.text.primary
    },
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    root_menu: {
        maxWidth: 345,
        flexGrow: 1,
        margin: '10px 10px'
    },
    btn: {
        margin: '10px 20px 10px 0px'
    }
}));

const DATA_CARD = [
    {
        title: "Migración Fulltime 2.7",
        descripcion: "Migrar datos de la BDD del Fulltime 2.7 a la BDD de nueva versión Fulltime V3",
        option: 1
    },
    {
        title: "Migración DataFlex",
        descripcion: "Migrar datos de la BDD DataFlex a la BDD de nueva versión Fulltime V3",
        option: 2
    },
]


export default function Migracion(props) {
    console.log(props);
    const { baseDatos } = props
    const classes = useStyles();

    const [optionsQueryFT3, setOptionsQueryFT3] = useState({})
    const [optionsQueryFT2_7, setOptionsQueryFT2_7] = useState({})


    const [activeUno, setActiveUno] = useState(false);
    const [activeDos, setActiveDos] = useState(false);
    const [titleSelect, setTitleSelect] = useState('')

    const atrasMetodo = () => {
        setActiveDos(false)
        setActiveUno(false)
    }

    const renderAtrasBtn = (
        <>
            <Typography className={classes.titulo} variant="h4" align="left" component="h5">
                <Button 
                    className={classes.btn}
                    variant="contained" 
                    color="primary" 
                    startIcon={<ArrowBackIcon />} 
                    onClick={atrasMetodo} >
                    Atrás
                </Button>
                { titleSelect }
                { activeUno && <DialogFulltime27 /> }
                { activeDos && <DialogDataflex /> }
            </Typography>
        </>
    )

    const renderFulltime2_7 = (
        <>
            {renderAtrasBtn}
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo} variant="h4" align="center" component="h5">
                            Conectar Fulltime 2.7
                        </Typography>
                        <FormFulltime27 baseDatos={baseDatos} setOptionsQueryFT2_7={setOptionsQueryFT2_7} optionsQueryFT2_7={optionsQueryFT2_7} />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo} variant="h4" align="center" component="h5">
                            Conectar Fulltime V3
                        </Typography>
                        <FormFulltime3 baseDatos={baseDatos} setOptionsQueryFT3={setOptionsQueryFT3} optionsQueryFT3={optionsQueryFT3} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    { (optionsQueryFT2_7.user && optionsQueryFT3.user) 
                        && <ConexionFT3FT27 fulltime3={optionsQueryFT3} fulltime2_7={optionsQueryFT2_7} /> 
                    }
                </Grid>
            </Grid>
        </>
    )

    const renderDataFlex = (
        <>
            {renderAtrasBtn}
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo} variant="h4" align="center" component="h5">
                            Conectar Fulltime V3
                        </Typography>
                        <FormFulltime3 baseDatos={baseDatos} setOptionsQueryFT3={setOptionsQueryFT3} optionsQueryFT3={optionsQueryFT3} />
                    </Paper>
                </Grid>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Typography className={classes.titulo} variant="h4" align="center" component="h5">
                            Importar Dataflex
                        </Typography>
                        <Grid container spacing={2}>
                            { optionsQueryFT3.user && camposExp.map(o => {
                                
                                return (
                                    <Grid item xs={6} key={o.id}>
                                        <ExpDataFlex campos={o} key={o.id} optionsQueryFT3={optionsQueryFT3} />
                                    </Grid>   
                                )
                                
                            }) }
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )

    const handlerOpcion = (o) => {
        const { title, option } = o;
        setTitleSelect(title)
        switch (option) {
            case 1:
                setActiveUno(true); setActiveDos(false);
                break;
            case 2:
                setActiveDos(true); setActiveUno(false);
                break;
            default:
                setActiveUno(false); setActiveDos(false);
                break;
        }
    }

    const renderCardOptions = (
        <Grid container spacing={2}>
            { DATA_CARD.map(o => {
                return (
                    <Grid item xs={6} key={o.option}>
                        <Card className={classes.root_menu}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {o.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {o.descripcion}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="primary" onClick={() => handlerOpcion(o)} >
                                    Mostrar formularios
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )
             })
            }
        </Grid>
    )

    return (
        <div className={classes.root}>
            { (!activeUno && !activeDos) && renderCardOptions}
            {activeUno && renderFulltime2_7}
            {activeDos && renderDataFlex}
            {/* {renderFulltime2_7} */}
        </div>
    )
}