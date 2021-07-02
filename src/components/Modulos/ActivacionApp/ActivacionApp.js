import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableHead from '@material-ui/core/TableHead';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import { toast } from 'react-toastify';

import TablePag from '../../Table/TablePaginationActions';
import DialogApp from '../../Dialog/DialogApp';

const useStyles2 = makeStyles({
    table: {
        minWidth: 500,
    },
});

export default function ActivacionApp(props) {
    const classes = useStyles2();
    const { dataname } = props;

    const [rows, setUserEmploys] = useState([]);

    useEffect(() => {
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
        return () => {
            setUserEmploys([])
        }
    }, [dataname])

    /***************************************************************************************/
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
    /***************************************************************************************/
    const [open, setOpen] = useState(false);
    const [userSelectChange, setUserSelectChange] = useState(null)

    const openDialogApp = (empleado) => {
        setOpen(true);
        setUserSelectChange(empleado);
    }
    const closeDialogApp = (value) => {
        if (value !== null) {
            handlerSave(value)
        }
        setOpen(false);
        setUserSelectChange(null)
    };
    /***************************************************************************************/
    const handlerSave = (value) => {
        const { id_user, fullname } = userSelectChange;

        window.api.send("Api/putUserApp", { namedb: dataname, data: {value, id_user} });
        window.api.receive("putUserApp", (data) => {
            if (data.err) {
                toast.error(data.err)
            } else {
                const [ obj ] = data
                const nuevo = rows.map(o => {
                    if (o.id_user === id_user) {
                        o.app_habilita = obj.app_habilita
                    }
                    return o
                })

                if (obj.app_habilita) {
                    toast.success(`${fullname} habilitado para usar reloj virtual`)
                } else {
                    toast.warn(`${fullname} deshabilitado para usar reloj virtual`)
                }
                setUserEmploys(nuevo)
            }
        });
    }

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
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    { (rowsPerPage > 0
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
                            <TableCell>
                                <IconButton aria-label="expand row" size="small" onClick={() => openDialogApp(row)}>
                                    <OpenWithIcon />
                                </IconButton>
                                {open && <DialogApp
                                    open={open}
                                    closeDialogApp={closeDialogApp}
                                    empleado={userSelectChange} />
                                }
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
                            colSpan={12}
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