import React, { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    title: {
        color: '#22a0ff',
        fontSize: '25px'
    },
    subtitle: {
        color: '#464646',
        fontSize: '18px'
    },
    btn: {
        margin: '10px 35%'
    }
});
export default function Licencia(props) {
    const { dataname } = props;
    const cls = useStyles();
    const [licencia, setLicencia] = useState(defaultValueLicencias())
    const [booleanLicencias, setBooleanLicencias] = useState(false)
    const [booleanVista, setbooleanVista] = useState(false)

    useEffect(() => {
        window.api.send("Api/obtenerLicencia", { namedb: dataname });
        window.api.receive("obtenerLicencia", (data) => {
            console.log(data);
            if (!data.err) {
                if (data.licenciaAdmin === undefined || data.licenciaClient === undefined) {
                    setBooleanLicencias(false)
                    setbooleanVista(false)
                    setLicencia(defaultValueLicencias())
                } else {
                    setBooleanLicencias(true)
                    setLicencia(data)
                    if (data.licenciaClient.public_key) {
                        setbooleanVista(true)
                    }
                }
            } else {
                setBooleanLicencias(false)
                setbooleanVista(false)
                setLicencia(defaultValueLicencias())
            }
        });
        return () => {
            setLicencia(defaultValueLicencias())
            setBooleanLicencias(false)
            setbooleanVista(false)
        }
    }, [dataname]);

    const handlerSave = (client_public_key) => {
        window.api.send("Api/putlicenciaEmpresa", { namedb: dataname, public_key: client_public_key});
        window.api.receive("putlicenciaEmpresa", (data) => {
            console.log(data);
            if (!data.err) {
                setbooleanVista(true)
            }
        });
    }

    const renderAgregarLicencia = () => {
        const { public_key } = licencia.licenciaAdmin
        return (
            <>
                <Typography className={cls.title} align="center" component="div">
                    Agregar la licencia a la Empresa.
                </Typography>
                <Typography className={cls.subtitle} align="center" component="p">
                    <b>Public key: </b> {public_key} <br />
                </Typography>
                <Button className={cls.btn} type="Submit" variant="contained" color="primary" onClick={() => handlerSave(public_key)}>
                    Agregar
                </Button>
            </>
        )
    }

    const renderInformacionLicencia = () => {

        const { fec_activacion, fec_desactivacion, public_key, private_key } = licencia.licenciaAdmin
        return (
            <>
                <Typography className={cls.title} align="center" component="div">
                    Versión de Sorftware
                </Typography>
                <Typography className={cls.subtitle} align="center" component="div">
                    Fulltime_v3.0.0 - Build:2020
                </Typography>
                <Typography className={cls.title} align="center" component="div">
                    Información de licencia
                </Typography>
                <Typography className={cls.subtitle} align="center" component="p">
                    <b>Software: </b> Fulltime V3 <br />
                    <b>Fecha Activacion: </b> {fec_activacion} <br />
                    <b>Valido hasta: </b> {fec_desactivacion} <br />
                    <b>Public key: </b> {public_key} <br />
                    <b>Private key: </b> {private_key} <br />
                </Typography>
            </>
        )
    }

    const renderViewLicencias = (
        <>
        { booleanVista 
            ? renderInformacionLicencia()
            : renderAgregarLicencia()
        }
        </>
    )

    return (
        <>
            { booleanLicencias 
                ? renderViewLicencias
                :
                <Typography variant="h4" align="center" component="h4">
                    FALTA AGREGAR LICENCIA
                </Typography>
            }
        </>
    )
}

function defaultValueLicencias() {
    return {
        licenciaAdmin: {
            public_key: null
        },
        licenciaClient: {
            public_key: null
        }
    }
}
