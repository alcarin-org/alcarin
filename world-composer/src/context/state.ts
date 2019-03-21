import * as MACGrid from '../data/atmosphere/MACGrid';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';
import * as Particles from '../data/convectable/Particles';
import * as FluidSources from '../data/engine/FluidSourcesEngine';
import * as RandomizeField from '../data/atmosphere/RandomizeField';

const DefaultWorldSize = 20;

export enum MapType {
    Neutral,
    Pressure,
    Velocity,
    Divergence,
}

export enum MapMode {
    Neutral,
    WallEditor,
    SourcesAndSinks,
}

export function createSimulationContext(
    randomMethod?: RandomizeField.RandomMethod
) {
    const newGrid = MACGrid.create(DefaultWorldSize);
    const newEngine = new AtmosphereEngine(newGrid);
    const newParticles: Particles.ParticlesData = Particles.create();
    const newSourcesEngine = FluidSources.create();

    return {
        grid: newGrid,
        engine: newEngine,
        particles: newParticles,
        sources: newSourcesEngine,
    };
}

const SimulationContextState = {
    simulation: createSimulationContext(),
    settings: {
        drawFieldSize: 25,
        // map type tell map render mode
        mapType: MapType.Neutral,
        // map interaction mode, how clicks interact with map
        mapInteraction: {
            mode: MapMode.Neutral,
            // specific map interaction mode could need some config data
            data: null as any,
        },
    },
    test: 0,
};

export default SimulationContextState;
