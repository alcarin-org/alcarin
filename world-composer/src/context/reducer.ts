import React from 'react';
import SimulationState, { createSimulationContext } from './state';
import { ActionType, AllActionTypes } from './actions';
import { fillGridVelocityBy } from '../data/atmosphere/MACGrid';
import * as Particles from '../data/convectable/Particles';
import * as FluidSources from '../data/engine/FluidSourcesEngine';
import * as RandomizeField from '../data/atmosphere/RandomizeField';
import ParticlesReducer from './reducers/particles-reducer';
import SourecesReducer from './reducers/sources-reducer';

export type Dispatch = React.Dispatch<AllActionTypes>;
export type Reducer = React.Reducer<typeof SimulationState, AllActionTypes>;

export function composeReducers(reducers: Reducer[]): Reducer {
    return function composedReducer(
        state: typeof SimulationState,
        action: AllActionTypes
    ) {
        return reducers.reduce(
            (state, reducer) => reducer(state, action),
            state
        );
    };
}

export default composeReducers([reducer, ParticlesReducer, SourecesReducer]);

function reducer(state: typeof SimulationState, action: AllActionTypes) {
    const { grid, particles, sources, engine } = state.simulation;
    switch (action.type) {
        case ActionType.UpdateSimulation:
            // tmp solution
            engine.grid = grid;
            const deltaTimeSec = action.payload.deltaTimeSec;
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
                },
            };
            break;
        case ActionType.SetMapType:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    mapType: action.payload.mapType,
                },
            };
        case ActionType.SetMapMode:
            return {
                ...state,
                settings: { ...state.settings, mapInteraction: action.payload },
            };
        case ActionType.ToggleSolid:
            // side effects for performance, think about dropping them
            // action.payload.gridPos
            state.simulation.engine.toggleSolid(
                action.payload.gridPos,
                action.payload.solidNewState
            );

            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    grid: state.simulation.engine.grid,
                },
            };

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
}

function getRandomFillMethod() {
    const randomMethods = [
        RandomizeField.Chaotic,
        RandomizeField.GlobalCurl,
        RandomizeField.LeftWave,
        RandomizeField.RightWave,
    ];
    return randomMethods[Math.floor(Math.random() * randomMethods.length)];
}
