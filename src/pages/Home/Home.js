import React, { useState, useEffect } from 'react';
import HomeComponent from '../../components/Home';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";

import './Home.scss';

const useStyles = makeStyles(() => ({
    titulo: {
        padding: '15px 0px',
        fontSize: '25px'
    },
}));

export default function Home(props) {
    const { handlerOpenTables, baseDatos } = props
    const classes = useStyles();

    const [licencias, setLicencias] = useState(null);

    const [ListaBdd, setListaBdd] = useState(null)

    useEffect(() => {
        window.api.send("Api/getLicencias");
        window.api.receive("getLicencias", (data) => {
            console.log(data);
            setLicencias(data);

        });

        return () => {
            setLicencias(null)
        }
    }, []);

    const mapearLista = () => {

        if (licencias !== null) {
            const filtro = baseDatos.map(o => {
                const [objeto] = licencias.filter(e => {
                    return e.name_database === o.datname 
                }).map(e => {
                    e.pg_size_pretty = o.pg_size_pretty
                    return e
                })
    
                return objeto
            }).filter(o => {
                return o !== undefined
            })

            console.log(filtro);
    
            setListaBdd(filtro)
        }
    }

    return (
        <>
            <Typography className={classes.titulo} variant="h4" align="center" component="h5">
                BDD Disponibles Administrar
            </Typography>
            {ListaBdd 
                ? <HomeComponent handlerOpenTables={handlerOpenTables} baseDatos={ListaBdd} />
                : mapearLista()
            }
        </>
    )
}