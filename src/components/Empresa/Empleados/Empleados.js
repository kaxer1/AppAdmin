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

export default function Empleados(props) {
    const { empleado: { activos, inactivos, total} } = props;
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.pos} variant="h5" component="h2">
                    Empleados
                </Typography>
                <Typography variant="body2" component="p">
                    <b>Activos:</b> {activos} <br />
                    <b>Inactivos:</b> {inactivos} <br />
                    <b>Total:</b> {total} <br />
                </Typography>
            </CardContent>
        </Card>
    )
}
