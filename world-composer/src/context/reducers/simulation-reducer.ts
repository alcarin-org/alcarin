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

const VelocityFieldUpdateDelaySec = 0.1;
const ParticlesCleanupDelaySec = 0.2;

const velocityFieldNeedUpdate = timePassChecker(VelocityFieldUpdateDelaySec);
const particlesNeedCleanup = timePassChecker(ParticlesCleanupDelaySec);

export default (
    state: typeof SimulationState,
    action: AllActionTypes
): SimulationContextStateType => {
    const { grid, particles, sources, artifacts } = state.simulation;

    switch (action.type) {
        case ActionType.UpdateSimulation:
            const deltaTimeSec =
                action.payload.deltaTimeSec * state.settings.timeFactor;
            let currentGrid = grid;
            let lastPressureVector = artifacts.lastPressureVector;

            // progress velocity field
            const [velNeedUpdate, velTimePassSec] = velocityFieldNeedUpdate(
                deltaTimeSec
            );
            if (velNeedUpdate) {
                const engineUpdateResult = AtmosphereEngine.update(
                    grid,
                    velTimePassSec,
                    state.settings.calcDetailsFactor
                );
                currentGrid = engineUpdateResult.grid;
                lastPressureVector =
                    engineUpdateResult.artifacts.pressureVector;
            }

            // progress particles
            const [partNeedCleanup] = particlesNeedCleanup(deltaTimeSec);

            const cleanedParticles = partNeedCleanup
                ? FluidSources.cleanupSinksOn(particles, sources)
                : particles;

            const newParticles = FluidSources.applyFluidSourcesOn(
                currentGrid,
                cleanedParticles,
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
                    artifacts: {
                        lastPressureVector,
                    },
                },
            };
            break;

        case ActionType.ResetMap:
            return {
                ...state,
                simulation: createSimulationContext(),
            };

        case ActionType.RandomizeMap:
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

function timePassChecker(intervalSec: number) {
    let timer = 0;
    return function timePassed(
        deltaTimeSec: DOMHighResTimeStamp
    ): [boolean, number] {
        timer += deltaTimeSec;
        if (timer >= intervalSec) {
            const timerState = timer;
            timer = 0;
            return [true, timerState];
        }

        return [false, 0];
    };
}
