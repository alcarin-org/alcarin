import * as MACGrid from '../data/atmosphere/MACGrid';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';
import { ParticlesEngine } from '../data/engine/ParticlesEngine';
import { FluidSourcesEngine } from '../data/engine/FluidSourcesEngine';
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
    const newGrid = MACGrid.create(
        DefaultWorldSize,
        // baseContext ? baseContext.grid.solids : undefined,
        undefined,
        randomMethod
    );
    const newEngine = new AtmosphereEngine(newGrid);
    const newParticlesEngine: ParticlesEngine = new ParticlesEngine(
        newEngine,
        // baseContext ? baseContext.particles.particles : undefined
        undefined
    );
    const newSourcesEngine = new FluidSourcesEngine(
        newEngine,
        newParticlesEngine
        // sourcesEngine
    );
    newEngine.onSimulationTick(deltaTimeSec =>
        newSourcesEngine.update(deltaTimeSec)
    );

    return {
        grid: newGrid,
        engine: newEngine,
        particles: newParticlesEngine,
        sources: newSourcesEngine,
    };
}

const InteractionContextState = {
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

export default InteractionContextState;
