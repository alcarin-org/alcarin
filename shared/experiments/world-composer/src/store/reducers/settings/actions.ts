import { MapMode, MapType } from './state';

export enum ActionType {
    SetMapType = 'SetMapType',
    SetMapMode = 'SetMapMode',
    SetTimeFactor = 'SetTimeFactor',
    SetCalcDetailsFactor = 'SetCalcDetailsFactor',
    IncreaseMapView = 'IncreaseMapView',
    DecreaseMapView = 'DecreaseMapView',
}

const actionCreators = {
    increaseMapView: () => ({
        type: ActionType.IncreaseMapView as ActionType.IncreaseMapView,
    }),

    decreaseMapView: () => ({
        type: ActionType.DecreaseMapView as ActionType.DecreaseMapView,
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
    setTimeFactor: (timeFactor: number) => ({
        type: ActionType.SetTimeFactor as ActionType.SetTimeFactor,
        payload: { timeFactor },
    }),
    setCalcDetailsFactor: (calcDetailsFactor: number) => ({
        type: ActionType.SetCalcDetailsFactor as ActionType.SetCalcDetailsFactor,
        payload: { calcDetailsFactor },
    }),
};

type ValueOf<T> = T[keyof T];

type TActions = typeof actionCreators;

export type Action = ValueOf<
    { [P in keyof TActions]: ReturnType<TActions[P]> }
>;

export default actionCreators;
