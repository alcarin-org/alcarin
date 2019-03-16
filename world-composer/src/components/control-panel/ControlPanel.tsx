import React, { useState } from 'react';
import Stats from './Stats';
import { useInteractionContext } from '../../context/InteractionContext';
import { MapMode } from '../../context/interaction/state';
import { ActionType } from '../../context/interaction/reducer';
import { FluidSource } from '../../data/engine/FluidSourcesEngine';
import { FluidSourcePanel, DefaultFluidSource } from './FluidSourcePanel';

export enum ControlPanelMode {
    Stats,
    Walls,
    Sources,
    Sinks,
}

type MapModeLegalPayload = FluidSource | null;

interface Tab {
    mode: ControlPanelMode;
    mapMode: MapMode;
    label: string;
    defaultPayload: MapModeLegalPayload;
}

const TabsDefinition: Tab[] = [
    {
        mode: ControlPanelMode.Stats,
        mapMode: MapMode.Neutral,
        label: 'Statistics',
        defaultPayload: null,
    },
    {
        mode: ControlPanelMode.Walls,
        mapMode: MapMode.WallEditor,
        label: 'Setup walls',
        defaultPayload: null,
    },
    {
        mode: ControlPanelMode.Sources,
        mapMode: MapMode.SourcesAndSinks,
        label: 'Fluid sources',
        defaultPayload: DefaultFluidSource,
    },
    {
        mode: ControlPanelMode.Sinks,
        mapMode: MapMode.SourcesAndSinks,
        label: 'Fluid ssetMapModeinks',
        defaultPayload: null,
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
    const [currentTab, setCurrentTab] = useState(TabsDefinition[0]);
    const { dispatch } = useInteractionContext();

    function setCurrentModePayload(
        mapMode: MapMode,
        payload: MapModeLegalPayload
    ) {
        dispatch(setMapModeAction(mapMode, payload));
    }

    function onPayloadChanged(payload: MapModeLegalPayload) {
        dispatch(setMapModeAction(currentTab.mapMode, payload));
    }

    return (
        <div className="control-panel">
            <div className="pure-button-group">
                {TabsDefinition.map(tab => (
                    <button
                        key={tab.mode}
                        onClick={() => {
                            setCurrentTab(tab);
                            setCurrentModePayload(
                                tab.mapMode,
                                tab.defaultPayload
                            );
                        }}
                        className={
                            'pure-button' +
                            (currentTab.mode === tab.mode
                                ? ' pure-button-active'
                                : '')
                        }
                        role="button"
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="control-panel__tabs">
                <div className="control-panel__tab">
                    {renderTab(currentTab.mode, onPayloadChanged)}
                </div>
            </div>
        </div>
    );
}

function renderTab(
    mode: ControlPanelMode,
    onPayloadChanged: (payload: MapModeLegalPayload) => void
) {
    switch (mode) {
        case ControlPanelMode.Stats:
            return <Stats mouseOver={[0, 0]} />;
        case ControlPanelMode.Sources:
            return (
                <>
                    <p>
                        In Sources Editor mode you can dynamically
                        create/destroy fluid sources on the map. Use left mouse
                        button to create a fluid source or right to destroy one.
                    </p>
                    <FluidSourcePanel onSourceChanged={onPayloadChanged} />
                </>
            );
        case ControlPanelMode.Walls:
            return (
                <p>
                    In Walls Editor mode you can dynamically create/destroy
                    walls on the map. Use left mouse button to create a wall or
                    right to destroy a wall. You can not destroy border walls,
                    as their are essential for simulation.
                </p>
            );
        default:
            return null;
    }
}
