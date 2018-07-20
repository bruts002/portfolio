import React from 'react';
import { withRouter, Link } from 'react-router-dom';

import './sideBar.css';
import { APPS } from '../App.consts';

const Sidebar = ({
    setApp
}) => <div className='side-bar'>
    Sidebar
    <div>
        {Object.keys(APPS).map( app => (
            <Link
                to={'/' + APPS[app]}
                key={app}
            >{app}</Link>
        ))}
    </div>
</div>

export default withRouter(Sidebar);
