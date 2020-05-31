import { ActionType, Action } from './actions';
import InitialState from './state';

type StateType = typeof InitialState;

export default (state = InitialState, action: Action): StateType => {
    switch (action.type) {
        case ActionType.IncreaseMapView: {
            const newSize = Math.max(5, state.drawFieldSize - 5);
            return {
                ...state,
                drawFieldSize: newSize,
            };
        }
        case ActionType.DecreaseMapView: {
            const newSize = Math.min(50, state.drawFieldSize + 5);
            return {
                ...state,
                drawFieldSize: newSize,
            };
        }

        case ActionType.SetMapType:
            return {
                ...state,
                mapType: action.payload.mapType,
            };
        case ActionType.SetMapMode:
            return {
                ...state,
                mapInteraction: action.payload,
            };

        case ActionType.SetTimeFactor:
            return {
                ...state,
                timeFactor: action.payload.timeFactor,
            };

        case ActionType.SetCalcDetailsFactor:
            return {
                ...state,
                calcDetailsFactor: action.payload.calcDetailsFactor,
            };

        default:
            return state;
    }
};
