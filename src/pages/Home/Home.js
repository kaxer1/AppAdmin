import React from 'react';
import HomeComponent from '../../components/Home';

import './Home.scss';


export default function Home(props) {
    const { handlerOpenTables, baseDatos } = props

    return (
        <>
            <p className="title"> BDD Disponibles Administrar</p>
            <HomeComponent handlerOpenTables={handlerOpenTables} baseDatos={baseDatos} />
        </>
    )
}