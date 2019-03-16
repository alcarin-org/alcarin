import { Dispatch } from 'react';
import { InteractionContextState } from './state';

export enum ActionType {
    UpdateFps,
    SetMapType,
}

export interface Action {
    type: ActionType;
    payload: any;
}

export type Dispatch = Dispatch<Action>;

export default (state: InteractionContextState, action: Action) => {
    switch (action.type) {
        case ActionType.UpdateFps:
            return { ...state, fps: action.payload };
        case ActionType.SetMapType:
            return {
                ...state,
                settings: { ...state.settings, mapType: action.payload },
            };
        default:
            return state;
    }
};
