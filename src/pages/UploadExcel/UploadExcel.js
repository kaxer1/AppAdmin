import React, { useEffect, useState } from 'react';
import Upload from '../../components/Upload';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
    titulo: {
        padding: '5px 0px',
        fontSize: '25px'
    }
});

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useRowStyles();

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="left">{row.empresa}</TableCell>
                <TableCell align="left">{row.name_database}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>

                            <Typography variant="h6" gutterBottom component="div">
                                Subir Plantilla
                            </Typography>
                            <Upload name_database={row.name_database} />

                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export default function UploadExcel() {
    const classes = useRowStyles();

    const [licencias, setLicencias] = useState(null);

    useEffect(() => {
        window.api.send("Api/getLicencias");
        window.api.receive("getLicencias", (data) => {
            console.log(data);
            setLicencias(data)
        });

        return () => {
            setLicencias(null)
        }
    }, []);

    const renderData = () => {

        console.log(licencias);

        return (
            <TableContainer component={Paper}>
                <Table aria-label="collapsible table">
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell align="left">Nombre Empresa</TableCell>
                            <TableCell align="left">Base de datos</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {licencias.map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    return (
        <div>
            <Typography className={classes.titulo} variant="h4" align="center" component="h5">
                Subir información de la empresa por plantilla
            </Typography>
            {licencias && renderData()}
        </div>
    )
}
