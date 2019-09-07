import * as MACGrid from '../../../data/atmosphere/MACGrid';
import * as Particles from '../../../data/convectable/Particles';
import * as FluidSources from '../../../data/engine/FluidSourcesEngine';
import * as RandomizeField from '../../../data/atmosphere/RandomizeField';

import SettingsInitialState from '../settings/state';

const DefaultWorldSize = 20;

export function createSimulationContext(
    randomMethod?: RandomizeField.RandomMethod
) {
    const newGrid = MACGrid.create(DefaultWorldSize);
    const newParticles: Particles.ParticlesData = Particles.create();
    const newSourcesEngine = FluidSources.create();

    return {
        settings: SettingsInitialState,

        grid: newGrid,
        particles: newParticles,
        sources: newSourcesEngine,
        artifacts: {
            lastPressureVector: new Float32Array(newGrid.size ** 2),
        },
    };
}

export default createSimulationContext();
