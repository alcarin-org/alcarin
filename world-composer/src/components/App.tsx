import React, { useEffect } from 'react';

import { SimulationContextProvider } from '../context/SimulationContext';
import { Page } from './Page';
import GlobalTimer from '../utils/Timer';

import { ipcRenderer } from '../electron-bridge';

export function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);
    useEffect(() => GlobalTimer.start(), []);

    return (
        <SimulationContextProvider>
            <Page />
        </SimulationContextProvider>
    );
}
