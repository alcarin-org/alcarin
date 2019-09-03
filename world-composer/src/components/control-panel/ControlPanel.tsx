import React, { useState } from 'react';

import { Stats } from './Stats';
import { GeneralSettings } from './GeneralSettings';
import { MapMode } from '../../context/state';
import { connectContext } from '../../context/SimulationContext';
import { FluidSource } from '../../data/engine/FluidSourcesEngine';
import { FluidSourcePanel, DefaultFluidSource } from './FluidSourcePanel';
import { FluidSinkPanel, DefaultFluidSink } from './FluidSinkPanel';

export enum ControlPanelMode {
    General,
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
        mode: ControlPanelMode.General,
        mapMode: MapMode.Neutral,
        label: 'General',
        defaultPayload: null,
    },
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
        label: 'Fluid sinks',
        defaultPayload: DefaultFluidSink,
    },
];

interface Props {
    setMapMode: (mode: MapMode, data?: any) => void;
}

export const ControlPanel = connectContext(
    ControlPanelComponent,
    ({ actions }) => ({
        setMapMode: actions.setMapMode,
    })
);

function ControlPanelComponent({ setMapMode }: Props) {
    const [currentTab, setCurrentTab] = useState(TabsDefinition[0]);

    function setCurrentModePayload(
        mapMode: MapMode,
        payload: MapModeLegalPayload
    ) {
        setMapMode(mapMode, payload);
    }

    function onPayloadChanged(payload: MapModeLegalPayload) {
        setMapMode(currentTab.mapMode, payload);
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
        case ControlPanelMode.General:
            return <GeneralSettings />;
        case ControlPanelMode.Stats:
            return <Stats />;
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
        case ControlPanelMode.Sinks:
            return (
                <>
                    <p>
                        In Sinks Editor mode you can dynamically create/destroy
                        fluid sinks on the map. Use left mouse button to create
                        a sink or right to destroy one.
                    </p>
                    <FluidSinkPanel onSinkChanged={onPayloadChanged} />
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
