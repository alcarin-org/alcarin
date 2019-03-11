import { createContext } from 'react';

import { MACGridData } from '../data/atmosphere/MACGrid';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';
import { FluidSourcesEngine } from '../data/engine/FluidSourcesEngine';

export interface SimulationContext {
    grid: MACGridData;
    engine: AtmosphereEngine;
    sources: FluidSourcesEngine;
}

export default createContext<SimulationContext | null>(null);
