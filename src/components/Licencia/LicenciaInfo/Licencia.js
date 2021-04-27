import React, { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    title: {
        color: '#22a0ff',
        fontSize: '25px'
    },
    subtitle: {
        color: '#464646',
        fontSize: '18px'
    }
});
export default function Licencia(props) {
    const { dataname } = props;
    const cls = useStyles();
    const [licencia, setLicencia] = useState(null)

    useEffect(() => {
        window.api.send("Api/obtenerLicencia", { namedb: dataname });
        window.api.receive("obtenerLicencia", (data) => {
            console.log(data);
            setLicencia(data)
        });
        return () => {
            setLicencia(null)
        }
    }, [dataname])

    return (
        <>
            {licencia ?
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
                        <b>Fecha Activacion: </b> {licencia.fec_activacion} <br />
                        <b>Valido hasta: </b> {licencia.fec_desactivacion} <br />
                        <b>Public key: </b> {licencia.public_key} <br />
                        <b>Private key: </b> {licencia.private_key} <br />
                    </Typography>                
                </>
                :
                <Typography variant="h4" align="center" component="h4">
                    FALTA AGREGAR LICENCIA
                </Typography>
            }
        </>
    )
}
