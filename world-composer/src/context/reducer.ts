import React from 'react';
import SimulationState, { SimulationContextStateType } from './state';
import { ActionType, AllActionTypes } from './actions';
import ParticlesReducer from './reducers/particles-reducer';
import SourecesReducer from './reducers/sources-reducer';
import SimulationReducer from './reducers/simulation-reducer';

export type Dispatch = React.Dispatch<AllActionTypes>;
export type Reducer = React.Reducer<typeof SimulationState, AllActionTypes>;

export default composeReducers([
    baseReducer,
    ParticlesReducer,
    SourecesReducer,
    SimulationReducer,
]);

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

function baseReducer(
    state: typeof SimulationState,
    action: AllActionTypes
): SimulationContextStateType {
    switch (action.type) {
        case ActionType.IncreaseMapView: {
            const newSize = Math.max(5, state.settings.drawFieldSize - 5);
            return {
                ...state,
                settings: {
                    ...state.settings,
                    drawFieldSize: newSize,
                },
            };
        }
        case ActionType.DecreaseMapView: {
            const newSize = Math.min(50, state.settings.drawFieldSize + 5);
            return {
                ...state,
                settings: {
                    ...state.settings,
                    drawFieldSize: newSize,
                },
            };
        }

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

        case ActionType.SetTimeFactor:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    timeFactor: action.payload.timeFactor,
                },
            };

        case ActionType.SetCalcDetailsFactor:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    calcDetailsFactor: action.payload.calcDetailsFactor,
                },
            };

        default:
            return state;
    }
}
