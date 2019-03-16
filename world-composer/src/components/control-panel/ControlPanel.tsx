import React, { useState } from 'react';
import Stats from './Stats';
import { useInteractionContext } from '../../context/InteractionContext';
import { MapMode } from '../../context/interaction/state';
import { ActionType } from '../../context/interaction/reducer';

export enum ControlPanelMode {
    Stats,
    Walls,
}

const TabsDefinition = [
    {
        mode: ControlPanelMode.Stats,
        mapMode: MapMode.Neutral,
        label: 'Statistics',
    },
    {
        mode: ControlPanelMode.Walls,
        mapMode: MapMode.WallEditor,
        label: 'Setup walls',
    },
];

function setMapModeAction(mapMode: MapMode, data?: any) {
    return {
        type: ActionType.SetMapMode,
        payload: {
            mode: mapMode,
            data,
        },
    };
}

export function ControlPanel() {
    const [mode, setMode] = useState(ControlPanelMode.Stats);
    const { dispatch } = useInteractionContext();
    const setMapMode = (mapMode: MapMode) =>
        dispatch(setMapModeAction(mapMode));

    return (
        <div className="control-panel">
            <div className="pure-button-group">
                {TabsDefinition.map(tab => (
                    <button
                        key={tab.mode}
                        onClick={() => {
                            setMode(tab.mode);
                            setMapMode(tab.mapMode);
                        }}
                        className={
                            'pure-button' +
                            (mode === tab.mode ? ' pure-button-active' : '')
                        }
                        role="button"
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="control-panel__tabs">
                <div className="control-panel__tab">{renderTab(mode)}</div>
            </div>
        </div>
    );
}

function renderTab(mode: ControlPanelMode) {
    switch (mode) {
        case ControlPanelMode.Stats:
            return <Stats mouseOver={[0, 0]} />;
        default:
            return (
                <p>
                    In Walls Editor mode you can dynamically create/destroy
                    walls on map. Use left mouse button to create a wall or
                    right to destroy a wall. You can not destroy border walls,
                    as their are essential for simulation.
                </p>
            );
    }
}
