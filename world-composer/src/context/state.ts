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
        artifacts: {
            lastPressureVector: new Float32Array(newGrid.size ** 2),
        },
    };
}

const SimulationContextState = {
    simulation: createSimulationContext(),
    settings: {
        // how fast time will pass for simulation, x1 means normal
        timeFactor: 1,
        // how many loops will be done when approximating solution of pressure
        // equtations
        calcDetailsFactor: 10,
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
