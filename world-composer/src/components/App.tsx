import React, { useEffect } from 'react';

import * as Particles from '../data/convectable/Particles';
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

const mapper = ({ state, actions }: SimulationContextType) => ({
    particles: state.simulation.particles,
    engine: state.simulation.engine,
    updateSimulation: actions.updateSimulation,
});
const SimulationRunner = connectContext(SimulationRunnerComponent, mapper);

interface Props {
    engine: AtmosphereEngine;
    particles: Particles.ParticlesData;
    updateSimulation: (deltaTimeSec: DOMHighResTimeStamp) => void;
}
function SimulationRunnerComponent({
    engine,
    particles,
    updateSimulation,
}: Props) {
    useEffect(
        () => {
            return GlobalTimer.onTick(onRenderTick);

            function onRenderTick(deltaTimeSec: DOMHighResTimeStamp) {
                updateSimulation(deltaTimeSec);
                engine.update(deltaTimeSec);
            }
        },
        [engine, particles, updateSimulation]
    );
    return null;
}
