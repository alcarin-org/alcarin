import { Dispatch } from 'react';
import InteractionContext, {createSimulationContext} from './state';
import { ActionType, AllActionTypes } from './actions';
import { fillGridVelocityBy } from '../data/atmosphere/MACGrid';
import * as RandomizeField from '../data/atmosphere/RandomizeField';

export type Dispatch = Dispatch<AllActionTypes>;

export default (state: typeof InteractionContext, action: AllActionTypes) => {
    switch (action.type) {
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

        case ActionType.RemoveSources:
            // side effects for performance, think about dropping them
            state.simulation.sources.removeSourcesAt(action.payload.gridPos);

            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    // sources should be data only
                    // sources: { ...state.simulation.sources },
                },
            };

        case ActionType.AddSources:
            // side effects for performance, think about dropping them
            state.simulation.sources.registerSource(action.payload.source);

            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    // sources should be data only, now its a class
                    // sources: { ...state.simulation.sources },
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
            console.warn('Unknown action', action);
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
