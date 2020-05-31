import React, { useEffect } from 'react';
import { Provider } from 'react-redux';

import { Page } from './Page';
import GlobalTimer from '../utils/Timer';
import { store } from '../store';

import { ipcRenderer } from '../electron-bridge';

export function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);
    useEffect(() => GlobalTimer.start(), []);

    return (
        <Provider store={store}>
            <Page />
        </Provider>
    );
}
