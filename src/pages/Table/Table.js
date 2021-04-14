import React from 'react';
import { Link } from "react-router-dom";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import TableInfo from '../../components/Table/TableInfo';
import './Table.scss';

export default function Table(props) {

    const { dataTableList: rows, titleDBB } = props;

    return (
        <>
            <p className="title">
                <Link className="btn-link" to="/home">
                    <NavigateBeforeIcon />
                </Link>
                BDD <span className="bdd_name">{titleDBB}</span>, lista de tablas.
            </p>
            <TableInfo rows={rows} />
        </>
    )
}