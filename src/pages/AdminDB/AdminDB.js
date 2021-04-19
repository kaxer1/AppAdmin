import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';

import TableInfo from '../../components/Table/TableInfo';
import ActivacionApp from '../../components/Modulos/ActivacionApp';
import ActivacionModulos from '../../components/Modulos/ActivacionModulos';
import './AdminDB.scss';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div className="admin_page"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box className="admin_page__content">
                    { children }
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function AdminDB(props) {

    const { dataTableList: rows, titleDBB } = props;

    const [value, setValue] = React.useState(2);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const [userEmploys, setUserEmploys] = useState([])

    useEffect(() => {
        window.api.send("ApiResquest", { funcion: "getUsersApp", namedb: titleDBB });
        window.api.receive("getUsersApp", (data) => {
            console.log(data);
            setUserEmploys(data)
        });
    }, [])

    return (
        <>
            <p className="title">
                <Link className="btn-link" to="/home">
                    <NavigateBeforeIcon />
                </Link>
                BDD <span className="bdd_name">{titleDBB}</span>
            </p>

            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={handleChange}
                    variant="fullWidth"
                    aria-label="disabled tabs example"
                >
                    <Tab label="Modulos" {...a11yProps(0)} />
                    <Tab label="Reloj virtual" {...a11yProps(1)} />
                    <Tab label="Tablas" {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0}>
                    <ActivacionModulos dataname={titleDBB} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ActivacionApp userEmploys={userEmploys} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <TableInfo rows={rows} />
                </TabPanel>
            </SwipeableViews>
        </>
    )
}