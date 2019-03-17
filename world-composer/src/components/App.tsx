import React, { useEffect, useState } from 'react';

import SimulationContext, {
    defaultContext,
} from '../context/SimulationContext';
import { InteractionContextProvider } from '../context/InteractionContext';
import { Page } from './Page';
import GlobalTimer from '../utils/Timer';

import { ipcRenderer } from '../electron-bridge';

export function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);
    useEffect(() => GlobalTimer.start(), []);
    const [simulationContext, setSimulationContext] = useState(defaultContext);
    return (
        <SimulationContext.Provider value={simulationContext}>
            <InteractionContextProvider>
                <Page onContextRecreated={setSimulationContext} />
            </InteractionContextProvider>
        </SimulationContext.Provider>
    );
}
