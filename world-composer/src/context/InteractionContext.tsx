import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import defaultState from './interaction/state';
import reducer, { Dispatch } from './interaction/reducer';

export interface InteractionContextType {
    state: typeof defaultState;
    dispatch: Dispatch;
}

const InteractionContextInstance = createContext<InteractionContextType>({
    state: defaultState,
    dispatch: () => null,
});

export function InteractionContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [state, dispatch] = useReducer(reducer, defaultState);
    const value = { state, dispatch };
    return (
        <InteractionContextInstance.Provider value={value}>
            {children}
        </InteractionContextInstance.Provider>
    );
}

export function useInteractionContext() {
    return useContext(InteractionContextInstance);
}
