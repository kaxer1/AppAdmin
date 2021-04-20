import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import { toast } from 'react-toastify';

import TablePag from '../../Table/TablePaginationActions';

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

export default function ActivacionApp(props) {
    const { dataname } = props;

    const [rows, setUserEmploys] = useState([]);

    useEffect(() => {
        getUsersApp();
        return () => {
            setUserEmploys([])
        }
    }, [])

    const getUsersApp = () => {
        window.api.send("Api/getUsersApp", { namedb: dataname });
        window.api.receive("getUsersApp", (data) => {
            console.log(data);
            if (data.err) {
                toast.error('Reloj Virtual: ' + data.err)
                setUserEmploys([])
            } else {
                setUserEmploys(data)
            }
        });
    }

    const classes = useStyles2();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const renderTable = (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre Completo</TableCell>
                        <TableCell>Usuario</TableCell>
                        <TableCell align="right">Cédula</TableCell>
                        <TableCell align="right">Código</TableCell>
                        <TableCell align="right">App</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : rows
                    ).map((row) => (
                        <TableRow key={row.id_user}>
                            <TableCell component="th" scope="row">
                                {row.fullname}
                            </TableCell>
                            <TableCell component="th" scope="row">
                                {row.usuario}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                                {row.cedula}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                                {row.codigo}
                            </TableCell>
                            <TableCell component="th" scope="row" align="right">
                                {row.app_habilita ? 'Si' : 'No'}
                            </TableCell>
                        </TableRow>
                    ))}

                    {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            SelectProps={{
                                inputProps: { 'aria-label': 'rows per page' },
                                native: true,
                            }}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                            ActionsComponent={TablePag.TablePaginationActions}
                        />
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )

    const handlerError = () => {
        return <h1>No hay registros de usuarios</h1>
    }


    return (
        <>
            {rows.length > 0 ? renderTable : handlerError()}
        </>
    )
}
