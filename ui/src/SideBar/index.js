import React, { Component } from 'react';

import './sideBar.css';
import APPS from '../App.consts';

export default () => <div className='side-bar'>
    Sidebar
    <ul>
        {Object.keys(APPS).map( app => <li>{app}</li>)}
    </ul>
</div>

