import { createContext } from 'react';

import { MACGridData } from '../../data/atmosphere/MACGrid';
import { AtmosphereEngine } from '../../data/engine/AtmosphereEngine';
import { ParticlesEngine } from '../../data/engine/ParticlesEngine';
import { FluidSourcesEngine } from '../../data/engine/FluidSourcesEngine';

export interface SimulationContext {
    grid: MACGridData;
    engine: AtmosphereEngine;
    particles: ParticlesEngine;
    sources: FluidSourcesEngine;
}

export default createContext<SimulationContext | null>(null);
