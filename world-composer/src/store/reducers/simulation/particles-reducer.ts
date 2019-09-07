import { ActionType, Action } from './actions';
import InitialState from './state';

import * as Particles from '../../../data/convectable/Particles';

type StateType = typeof InitialState;

export default (state = InitialState, action: Action): StateType => {
    switch (action.type) {
        case ActionType.SpawnParticles:
            const newParticles = Particles.fillWithRandomParticles(
                state.particles,
                action.payload.count,
                state.grid
            );
            return {
                ...state,
                particles: newParticles,
            };
        default:
            return state;
    }
};
