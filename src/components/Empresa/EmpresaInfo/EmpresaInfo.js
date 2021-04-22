import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        backgroundColor: '#F3F3F3',
    },
    pos: {
        marginBottom: 12,
    },
});

export default function EmpresaInfo(props) {
    const { empresa: { nombre, ruc, direccion, telefono, correo, representante, tipo_empresa } } = props;
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.pos} variant="h5" component="h2">
                    Información Empresa
                </Typography>
                <Typography variant="body2" component="p">
                    <b>Empresa:</b> {nombre} <br />
                    <b>Ruc:</b> {ruc} <br />
                    <b>Direccion:</b> {direccion} <br />
                    <b>Telefono:</b> {telefono} <br />
                    <b>Correo:</b> {correo} <br />
                    <b>Representante:</b> {representante} <br />
                    <b>Entidad:</b> {tipo_empresa} <br />
                </Typography>
            </CardContent>
        </Card>
    )
}
