import InitialState, { createSimulationContext } from './state';
import { Action as SimulationAction, ActionType } from './actions';
import { Action as SettingsAction } from '../settings/actions';

import * as MACGrid from '../../../data/atmosphere/MACGrid';
import * as AtmosphereEngine from '../../../data/engine/AtmosphereEngine';
import * as RandomizeField from '../../../data/atmosphere/RandomizeField';
import * as FluidSources from '../../../data/engine/FluidSourcesEngine';
import * as Particles from '../../../data/convectable/Particles';

import settingsReducer from '../settings';
import sourcesReducer from './sources-reducer';
import particlesReducer from './particles-reducer';

const VelocityFieldUpdateDelaySec = 0.1;
const ParticlesCleanupDelaySec = 0.2;

const velocityFieldNeedUpdate = timePassChecker(VelocityFieldUpdateDelaySec);
const particlesNeedCleanup = timePassChecker(ParticlesCleanupDelaySec);

type StateType = typeof InitialState;
type Action = SimulationAction | SettingsAction;

export default (baseState = InitialState, action: Action): StateType => {
    const settings = settingsReducer(
        baseState.settings,
        action as SettingsAction
    );
    const state =
        settings !== baseState.settings
            ? { ...baseState, settings }
            : baseState;

    const { grid, particles, sources, artifacts } = state;

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

                grid: currentGrid,
                particles: movedParticles,
                artifacts: {
                    lastPressureVector,
                },
            };

        case ActionType.ResetMap:
            return {
                ...createSimulationContext(),
                settings: state.settings,
            };

        case ActionType.RandomizeMap:
            MACGrid.fillGridVelocityBy(state.grid, getRandomFillMethod());
            return {
                ...state,
                grid: { ...state.grid },
            };

        case ActionType.ToggleSolid: {
            const newGrid = MACGrid.toggleSolid(
                grid,
                action.payload.gridPos,
                action.payload.solidNewState
            );
            return {
                ...state,
                grid: newGrid,
            };
        }
        default:
            return particlesReducer(
                sourcesReducer(state, action as any),
                action as any
            );
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
