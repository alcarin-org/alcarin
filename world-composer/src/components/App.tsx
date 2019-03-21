import React, { useEffect } from 'react';

import { ParticlesEngine } from '../data/engine/ParticlesEngine';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';

import {
    SimulationContextType,
    SimulationContextProvider,
    connectContext,
} from '../context/SimulationContext';
import { Page } from './Page';
import GlobalTimer from '../utils/Timer';

import { ipcRenderer } from '../electron-bridge';

export function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);
    useEffect(() => GlobalTimer.start(), []);

    return (
        <SimulationContextProvider>
            <SimulationRunner />
            <Page />
        </SimulationContextProvider>
    );
}

const mapper = ({ state }: SimulationContextType) => ({
    particles: state.simulation.particles,
    engine: state.simulation.engine,
});
const SimulationRunner = connectContext(SimulationRunnerComponent, mapper);

interface Props {
    engine: AtmosphereEngine;
    particles: ParticlesEngine;
}
function SimulationRunnerComponent({ engine, particles }: Props) {
    useEffect(
        () => {
            return GlobalTimer.onTick(onRenderTick);

            function onRenderTick(deltaTimeSec: DOMHighResTimeStamp) {
                particles.update(deltaTimeSec);
                engine.update(deltaTimeSec);
            }
        },
        [engine, particles]
    );
    return null;
}
