import { Dispatch } from 'react';
import InteractionContext from './state';

export enum ActionType {
    UpdateFps,
    SetMapType,
    SetMapMode,
}

export interface Action {
    type: ActionType;
    payload: any;
}

export type Dispatch = Dispatch<Action>;

export default (state: typeof InteractionContext, action: Action) => {
    switch (action.type) {
        case ActionType.UpdateFps:
            return { ...state, fps: action.payload };
        case ActionType.SetMapType:
            return {
                ...state,
                settings: { ...state.settings, mapType: action.payload },
            };
        case ActionType.SetMapMode:
            return {
                ...state,
                settings: { ...state.settings, mapInteraction: action.payload },
            };
        default:
            console.warn('Unknown action', action);
            return state;
    }
};
