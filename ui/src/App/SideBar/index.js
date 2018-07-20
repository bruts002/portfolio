import React from 'react';

import './sideBar.css';
import { APPS } from '../App.consts';

export default ({
    setApp
}) => <div className='side-bar'>
    Sidebar
    <ul>
        {Object.keys(APPS).map( app => <li
        onClick={() => setApp(app)}
        >{app}</li>)}
    </ul>
</div>

