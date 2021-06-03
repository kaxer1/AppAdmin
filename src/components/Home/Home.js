import React, { useState } from 'react';
import { Link } from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import { makeStyles } from '@material-ui/core/styles';

import './Home.scss';

const useStyles = makeStyles((theme) => ({
    itemsform: {
        width: '300px',
        margin: theme.spacing(1),
    },
}));

export default function Home(props) {

    const cls = useStyles()
    const { handlerOpenTables, baseDatos } = props;

    const [searchBDD, setSearchBDD] = useState('');
    const [searchEmpresa, setsearchEmpresa] = useState('');

    const filteredDatabase = baseDatos.filter((bdd) => {
        // console.log(bdd);
        let fil1 = bdd.name_database.toLowerCase().indexOf(searchBDD) !== -1
        let fil2 = bdd.empresa.toLowerCase().indexOf(searchEmpresa) !== -1
        return fil1 === true && fil2 === true
    })

    const renderBaseDatos = filteredDatabase.map(obj => {
        return (
            <Grid item xs={4} key={obj.id}>
                <Paper className="cards">
                    <p className="cards__titulo">{obj.name_database}</p> 
                    <p className="cards__size"> {obj.empresa} </p>
                    <p className="cards__size">Tamaño {obj.pg_size_pretty} </p>
                    <Link to="/adminDB" className="cards__btn-link"
                        onClick={(e) => handlerOpenTables(obj.name_database)}>
                            <p className="text"> Abrir </p>
                    </Link>
                </Paper>
            </Grid>
        )
    })

    const handlerChangeBDD = (e) => {
        console.log(e.target.value);
        setSearchBDD(e.target.value.toLowerCase())
    }

    const handlerChangeEmpresa = (e) => {
        console.log(e.target.value);
        setsearchEmpresa(e.target.value.toLowerCase())
    }
 
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12} >
                    <TextField 
                        className={cls.itemsform}
                        id="filled-basic" 
                        label="Nombre BDD" 
                        variant="filled"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }} 
                        onChange={handlerChangeBDD} />
                    <TextField 
                        className={cls.itemsform}
                        id="filled-basic" 
                        label="Nombre Empresa" 
                        variant="filled"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }} 
                        onChange={handlerChangeEmpresa} />
                </Grid>
                { renderBaseDatos }
            </Grid>
        </>
    )
}
