import { Point } from '../../../utils/Math';
import { FluidSource } from '../../../data/engine/FluidSourcesEngine';

export enum ActionType {
    UpdateSimulation = 'UpdateSimulation',

    RandomizeMap = 'RandomizeMap',
    ToggleSolid = 'ToggleSolid',
    ResetMap = 'ResetMap',

    RemoveSources = 'RemoveSources',
    AddSources = 'AddSources',

    SpawnParticles = 'SpawnParticles',
}

const actionsCreators = {
    updateSimulation: (deltaTimeSec: DOMHighResTimeStamp) => ({
        type: ActionType.UpdateSimulation as ActionType.UpdateSimulation,
        payload: { deltaTimeSec },
    }),

    randomizeVelocityField: () => ({
        type: ActionType.RandomizeMap as ActionType.RandomizeMap,
    }),

    toggleSolid: (gridPos: Point, solidNewState: boolean) => ({
        type: ActionType.ToggleSolid as ActionType.ToggleSolid,
        payload: {
            gridPos,
            solidNewState,
        },
    }),

    resetMap: () => ({ type: ActionType.ResetMap as ActionType.ResetMap }),

    removeSourcesAt: (gridPos: Point) => ({
        type: ActionType.RemoveSources as ActionType.RemoveSources,
        payload: { gridPos },
    }),

    registerSource: (source: FluidSource) => ({
        type: ActionType.AddSources as ActionType.AddSources,
        payload: { source },
    }),

    spawnParticles: (count: number) => ({
        type: ActionType.SpawnParticles as ActionType.SpawnParticles,
        payload: { count },
    }),
};

type ValueOf<T> = T[keyof T];

type TActions = typeof actionsCreators;

export type Action = ValueOf<
    { [P in keyof TActions]: ReturnType<TActions[P]> }
>;

export default actionsCreators;
