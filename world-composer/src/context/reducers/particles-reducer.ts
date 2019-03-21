import { Dispatch } from 'react';
import SimulationState, { SimulationContextStateType } from '../state';
import { ActionType, AllActionTypes } from '../actions';
import * as Particles from '../../data/convectable/Particles';

export type Dispatch = Dispatch<AllActionTypes>;

export default (
    state: typeof SimulationState,
    action: AllActionTypes
): SimulationContextStateType => {
    switch (action.type) {
        case ActionType.SpawnParticles:
            const newParticles = Particles.fillWithRandomParticles(
                state.simulation.particles,
                action.payload.count,
                state.simulation.grid
            );
            return {
                ...state,
                simulation: {
                    ...state.simulation,
                    particles: newParticles,
                },
            };
        default:
            return state;
    }
};
