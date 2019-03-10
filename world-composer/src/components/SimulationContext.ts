import { createContext } from 'react';

import { MACGridData } from '../data/atmosphere/MACGrid';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';

export interface SimulationContext {
    grid: MACGridData;
    engine: AtmosphereEngine;
}

export default createContext<SimulationContext | null>(null);
