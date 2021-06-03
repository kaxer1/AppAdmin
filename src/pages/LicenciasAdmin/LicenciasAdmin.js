import React, { useEffect, useState} from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import LicenciaForm from '../../components/Licencia/LicenciaForm';
import LicenciaTable from '../../components/Licencia/LicenciaTable';

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
}));

export default function LicenciasAdmin(props) {
    const classes = useStyles();
    const { baseDatos: list } = props;

    const [licencias, setLicencias] = useState([]);
    useEffect(() => {
        window.api.send("Api/getLicencias");
        window.api.receive("getLicencias", (data) => {
            console.log(data);
            setLicencias(data)
        });

        return () => {
            setLicencias([])
        }
    }, [])

    const arrList = [...new Set(list.map(o => {
        return o.datname
    }))]
    const arrLicencias = [...new Set(licencias.map(o => {
        return o.name_database
    }))]

    arrLicencias.forEach(o => {
        removeItemFromArr(arrList, o)
    })

    // arrList.push("")
    
    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography className={classes.titulo} variant="h4" align="center" component="h5">
                        Administración de Licencias
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper className={classes.paper}>
                        <Typography className={classes.subtitulo} variant="h4" align="center" component="h5">
                            Registrar Licencia
                        </Typography>
                        <LicenciaForm arrSelectListBDD={arrList} setLicencias={setLicencias} licencias={licencias} />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Paper className={classes.paper}>
                        <Typography className={classes.subtitulo} variant="h4" align="center" component="h5">
                            Tabla de Licencias
                        </Typography>
                        <LicenciaTable licencias={licencias} />
                    </Paper>
                </Grid>
 
            </Grid>
        </div>
    )
}

function removeItemFromArr ( arr, item ) {
    var i = arr.indexOf( item );
 
    if ( i !== -1 ) {
        arr.splice( i, 1 );
    }
}