import { Dispatch } from 'react';
import SimulationState, { SimulationContextStateType } from '../state';
import { ActionType, AllActionTypes } from '../actions';
import * as FluidSources from '../../data/engine/FluidSourcesEngine';

export type Dispatch = Dispatch<AllActionTypes>;

export default (
    state: typeof SimulationState,
    action: AllActionTypes
): SimulationContextStateType => {
    const { grid, sources } = state.simulation;
    switch (action.type) {
        case ActionType.RemoveSources: {
            const newSources = FluidSources.removeSourcesAt(
                sources,
                action.payload.gridPos
            );
            const newGrid = FluidSources.applyPressureModifiersOn(
                grid,
                newSources
            );

            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    grid: newGrid,
                    sources: newSources,
                },
            };
        }
        case ActionType.AddSources: {
            const newSources = FluidSources.registerSource(
                sources,
                action.payload.source
            );
            const newGrid = FluidSources.applyPressureModifiersOn(
                grid,
                newSources
            );

            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    grid: newGrid,
                    sources: newSources,
                },
            };
        }
        default:
            return state;
    }
};
