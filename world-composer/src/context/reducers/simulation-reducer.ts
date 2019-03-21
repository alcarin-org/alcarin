import { Dispatch } from 'react';
import SimulationState, {
    SimulationContextStateType,
    createSimulationContext,
} from '../state';
import { ActionType, AllActionTypes } from '../actions';
import * as MACGrid from '../../data/atmosphere/MACGrid';
import * as AtmosphereEngine from '../../data/engine/AtmosphereEngine';
import * as RandomizeField from '../../data/atmosphere/RandomizeField';
import * as FluidSources from '../../data/engine/FluidSourcesEngine';
import * as Particles from '../../data/convectable/Particles';

export type Dispatch = Dispatch<AllActionTypes>;

const StepDelaySec = 0.1;

export default (
    state: typeof SimulationState,
    action: AllActionTypes
): SimulationContextStateType => {
    const { grid, particles, sources } = state.simulation;

    switch (action.type) {
        case ActionType.UpdateSimulation:
            const deltaTimeSec = action.payload.deltaTimeSec;
            let currentGrid = grid;

            let newEngineTimeAccSec =
                state.simulation.engineTimeAccSec + deltaTimeSec;
            if (newEngineTimeAccSec >= StepDelaySec) {
                currentGrid = AtmosphereEngine.update(
                    grid,
                    newEngineTimeAccSec
                );
                newEngineTimeAccSec = 0;
            }

            const newSources = FluidSources.update(sources, deltaTimeSec);

            const newParticles = FluidSources.applyFluidSourcesOn(
                currentGrid,
                particles,
                sources,
                deltaTimeSec
            );

            const movedParticles = Particles.update(
                newParticles,
                currentGrid,
                deltaTimeSec
            );

            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    grid: currentGrid,
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
            MACGrid.fillGridVelocityBy(
                state.simulation.grid,
                getRandomFillMethod()
            );
            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    grid: { ...state.simulation.grid },
                },
            };

        case ActionType.ToggleSolid: {
            // side effects for performance, think about dropping them
            // action.payload.gridPos

            const newGrid = MACGrid.toggleSolid(
                grid,
                action.payload.gridPos,
                action.payload.solidNewState
            );

            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    grid: newGrid,
                },
            };
        }
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
