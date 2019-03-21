import { Dispatch } from 'react';
import SimulationState, {
    SimulationContextStateType,
    createSimulationContext,
} from '../state';
import { ActionType, AllActionTypes } from '../actions';
import { fillGridVelocityBy } from '../../data/atmosphere/MACGrid';
import * as RandomizeField from '../../data/atmosphere/RandomizeField';
import * as FluidSources from '../../data/engine/FluidSourcesEngine';
import * as Particles from '../../data/convectable/Particles';

export type Dispatch = Dispatch<AllActionTypes>;

const StepDelaySec = 0.05;

export default (
    state: typeof SimulationState,
    action: AllActionTypes
): SimulationContextStateType => {
    const { grid, particles, sources, engine } = state.simulation;

    switch (action.type) {
        case ActionType.UpdateSimulation:
            // tmp solution
            engine.grid = grid;

            const deltaTimeSec = action.payload.deltaTimeSec;

            let newEngineTimeAccSec =
                state.simulation.engineTimeAccSec + deltaTimeSec;
            if (newEngineTimeAccSec > StepDelaySec) {
                engine.update(newEngineTimeAccSec);
                newEngineTimeAccSec = 0;
            }

            const newSources = FluidSources.update(sources, deltaTimeSec);

            const newParticles = FluidSources.applyFluidSourcesOn(
                grid,
                particles,
                sources,
                deltaTimeSec
            );

            const movedParticles = Particles.update(
                newParticles,
                deltaTimeSec,
                engine
            );

            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    particles: movedParticles,
                    sources: newSources,
                    engineTimeAccSec: newEngineTimeAccSec,
                },
            };
            break;

        case ActionType.ResetMap:
            return {
                ...state,
                simulation: createSimulationContext(),
            };

        case ActionType.RandomizeMap:
            // side effect
            fillGridVelocityBy(state.simulation.grid, getRandomFillMethod());
            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    grid: { ...state.simulation.grid },
                },
            };

        default:
            return state;
    }
};

function getRandomFillMethod() {
    const randomMethods = [
        RandomizeField.Chaotic,
        RandomizeField.GlobalCurl,
        RandomizeField.LeftWave,
        RandomizeField.RightWave,
    ];
    return randomMethods[Math.floor(Math.random() * randomMethods.length)];
}
