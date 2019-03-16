import { Dispatch } from 'react';
import { InteractionContextState } from './state';

export enum ActionType {
    UpdateFps,
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
        default:
            return state;
    }
};
