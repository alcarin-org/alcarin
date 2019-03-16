import React, { createContext, useReducer, ReactNode, useContext } from 'react';
import defaultState, { InteractionContextState } from './interaction/state';
import reducer, { Dispatch } from './interaction/reducer';

interface InteractionContextType {
    state: InteractionContextState;
    dispatch: Dispatch;
}

const InteractionContext = createContext<InteractionContextType>({
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
        <InteractionContext.Provider value={value}>
            {children}
        </InteractionContext.Provider>
    );
}

export function useInteractionContext() {
    return useContext(InteractionContext);
}
