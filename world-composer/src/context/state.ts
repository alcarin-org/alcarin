import * as MACGrid from '../data/atmosphere/MACGrid';
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
    const newParticles: Particles.ParticlesData = Particles.create();
    const newSourcesEngine = FluidSources.create();

    return {
        grid: newGrid,
        particles: newParticles,
        sources: newSourcesEngine,

        // engine do not need to be updated every frame, it's enough
        // to update it few times per second. we used it to decide if
        // enough time pass
        engineTimeAccSec: 0,
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
};

export type SimulationContextStateType = typeof SimulationContextState;

export default SimulationContextState;
