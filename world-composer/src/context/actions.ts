import { MapMode, MapType } from './state';
import { Point } from '../utils/Math';
import { FluidSource } from '../data/engine/FluidSourcesEngine';

export enum ActionType {
    SetMapType,
    SetMapMode,
    RandomizeMap,
    ToggleSolid,
    RemoveSources,
    AddSources,
    ResetMap,
}

export interface Action {
    type: ActionType;
    payload?: any;
}

const actions = {
    randomizeVelocityField: () => ({
        type: ActionType.RandomizeMap as ActionType.RandomizeMap,
    }),

    setMapMode: (mapMode: MapMode, data?: any) => ({
        type: ActionType.SetMapMode as ActionType.SetMapMode,
        payload: {
            mode: mapMode,
            data,
        },
    }),
    setMapType: (mapType: MapType) => ({
        type: ActionType.SetMapType as ActionType.SetMapType,
        payload: { mapType },
    }),

    toggleSolid: (gridPos: Point, solidNewState: boolean) => ({
        type: ActionType.ToggleSolid as ActionType.ToggleSolid,
        payload: {
            gridPos,
            solidNewState,
        },
    }),

    removeSourcesAt: (gridPos: Point) => ({
        type: ActionType.RemoveSources as ActionType.RemoveSources,
        payload: { gridPos },
    }),

    registerSource: (source: FluidSource) => ({
        type: ActionType.AddSources as ActionType.AddSources,
        payload: { source },
    }),

    resetMap: () => ({ type: ActionType.ResetMap as ActionType.ResetMap }),
};

type ValueOf<T> = T[keyof T];

type TActions = typeof actions;

export type AllActionTypes = ValueOf<
    { [P in keyof TActions]: ReturnType<TActions[P]> }
>;

export default actions;
