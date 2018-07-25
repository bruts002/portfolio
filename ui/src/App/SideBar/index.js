import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Tabs, Tab } from '@blueprintjs/core';

import './sideBar.css';
import { APPS } from '../App.consts';

const Sidebar = ({
    setApp
}) => <Tabs 
    id='sideBar'
    vertical={true}
    className='side-bar'>
    {Object.keys(APPS).map( app => (
        <Tab
            id={app}
            key={app}>
            <Link to={'/' + APPS[app]}>{app}</Link>
        </Tab>
    ))}
</Tabs>

export default withRouter(Sidebar);
