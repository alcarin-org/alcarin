import { createContext } from 'react';

import * as MACGrid from '../data/atmosphere/MACGrid';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';
import { ParticlesEngine } from '../data/engine/ParticlesEngine';
import {
    FluidSourcesEngine,
    FluidSourceType,
} from '../data/engine/FluidSourcesEngine';
import * as RandomizeField from '../data/atmosphere/RandomizeField';

const DefaultWorldSize = 20;

export interface SimulationContextType {
    grid: MACGrid.MACGridData;
    engine: AtmosphereEngine;
    particles: ParticlesEngine;
    sources: FluidSourcesEngine;
}

export function createSimulationContext(
    randomMethod?: RandomizeField.RandomMethod,
    baseContext?: SimulationContextType
) {
    const newGrid = MACGrid.create(
        DefaultWorldSize,
        baseContext ? baseContext.grid.solids : undefined,
        randomMethod
    );
    const newEngine = new AtmosphereEngine(newGrid);
    const newParticlesEngine: ParticlesEngine = new ParticlesEngine(
        newEngine,
        baseContext ? baseContext.particles.particles : undefined
    );
    const newSourcesEngine = new FluidSourcesEngine(
        newEngine,
        newParticlesEngine
        // sourcesEngine
    );
    newEngine.onSimulationTick(deltaTimeSec =>
        newSourcesEngine.update(deltaTimeSec)
    );

    // debug
    // newSourcesEngine.registerSource({
    //     gridPosition: [
    //         1 + Math.trunc(Math.random() * (newGrid.size - 2)),
    //         1 + Math.trunc(Math.random() * (newGrid.size - 2)),
    //     ],
    //     type: FluidSourceType.Omni,
    //     power: 15,
    //     particlesColor: [30, 255, 30, 128],
    //     particlesPerSecond: 105,
    // });

    newSourcesEngine.registerSource({
        gridPosition: [
            1 + Math.trunc(Math.random() * (newGrid.size - 2)),
            1 + Math.trunc(Math.random() * (newGrid.size - 2)),
        ],
        type: FluidSourceType.Sink,
        power: -20,
        particlesColor: [30, 255, 30, 128],
        particlesPerSecond: 0,
    });

    return {
        grid: newGrid,
        engine: newEngine,
        particles: newParticlesEngine,
        sources: newSourcesEngine,
    };
}

export const defaultContext = createSimulationContext();

export default createContext<SimulationContextType>(defaultContext);
