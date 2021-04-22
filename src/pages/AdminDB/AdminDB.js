import React from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';

import TableInfo from '../../components/Table/TableInfo';
import ActivacionApp from '../../components/Modulos/ActivacionApp';
import ActivacionModulos from '../../components/Modulos/ActivacionModulos';
import Empresa from '../../components/Empresa';
import Licencia from '../../components/Licencia';

import './AdminDB.scss';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div className="admin_page"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box className="admin_page__content">
                    {children}
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
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

export default function AdminDB(props) {

    const { dataTableList: rows, titleDBB } = props;

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

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
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    <Tab label="Licencia" {...a11yProps(0)} />
                    <Tab label="Empresa" {...a11yProps(1)} />
                    <Tab label="Modulos" {...a11yProps(2)} />
                    <Tab label="Reloj virtual" {...a11yProps(3)} />
                    <Tab label="Tablas" {...a11yProps(4)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0}>
                    <Licencia dataname={titleDBB} />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Empresa dataname={titleDBB} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <ActivacionModulos dataname={titleDBB} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <ActivacionApp dataname={titleDBB} />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <TableInfo rows={rows} />
                </TabPanel>
            </SwipeableViews>
        </>
    )
}