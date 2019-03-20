import React, {
    createContext,
    useReducer,
    ReactNode,
    useContext,
    useMemo,
} from 'react';
import defaultState from './state';
import actions from './actions';
import reducer, { Dispatch } from './reducer';

type ActionsTypes = typeof actions;
type ActionsDispatchers = {
    [P in keyof ActionsTypes]: (...args: Parameters<ActionsTypes[P]>) => void
};

export interface SimulationContextType {
    state: typeof defaultState;
    actions: ActionsDispatchers;
}

const SimulationContextInstance = createContext<SimulationContextType>({
    state: defaultState,
    actions: actionsFactory(() => null),
});

function actionsFactory(dispatch: Dispatch): ActionsDispatchers {
    // I find no way to properly type this function, so I drop typing inside
    // it and use "as ActionsDispatchers". if someone know how to do this,
    // let me know.
    // the problem is to conver an object of action creators functions to
    // object of same actions dispatchers
    return Object.entries(actions).reduce(
        (acc, [key, value]) => {
            const actionCreator = (actions as any)[key] as any;
            acc[key] = (...args: any[]) => {
                const action = actionCreator(...args);
                dispatch(action);
            };
            return acc;
        },
        {} as any
    ) as ActionsDispatchers;
}

export function SimulationContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [state, dispatch] = useReducer(reducer, defaultState);
    const actionsDispatchers: ActionsDispatchers = useMemo(
        () => actionsFactory(dispatch),
        [dispatch]
    );
    const value = { state, actions: actionsDispatchers };
    return (
        <SimulationContextInstance.Provider value={value}>
            {children}
        </SimulationContextInstance.Provider>
    );
}

type Diff<T, U> = T extends U ? never : T;
interface Props {
    [key: string]: any;
}
type PropsMapper<T extends Props> = (state: SimulationContextType) => T;

export function connectContext<
    TProps extends Props,
    TContextProps extends Partial<TProps>
>(
    Component: React.FunctionComponent<TProps>,
    propsMapper: PropsMapper<TContextProps>
) {
    const MemoComponent = React.memo(Component);

    type TMissingProps<TProps> = {
        [P in Diff<keyof TProps, keyof TContextProps>]: TProps[P]
    };

    return (props: TMissingProps<TProps>) => {
        const context = useContext(SimulationContextInstance);
        const contextPropsObj = propsMapper(context);
        const allProps = ({ ...contextPropsObj, ...props } as any) as TProps;

        return <MemoComponent {...allProps} />;
    };
}
