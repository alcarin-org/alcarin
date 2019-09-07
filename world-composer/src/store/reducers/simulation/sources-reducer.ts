import { ActionType, Action } from './actions';
import InitialState from './state';
import * as FluidSources from '../../../data/engine/FluidSourcesEngine';

type StateType = typeof InitialState;

export default (state = InitialState, action: Action): StateType => {
    const { grid, sources } = state;

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
                grid: newGrid,
                sources: newSources,
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
                grid: newGrid,
                sources: newSources,
            };
        }
        default:
            return state;
    }
};
