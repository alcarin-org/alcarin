import React from 'react';

import { Toolbar, ToolbarButton, ToolbarSeparator } from './common/Toolbar';
import { MapType } from '../context/state';
import { connectContext } from '../context/SimulationContext';

interface Props {
    onToggleControlPanel: (visible: boolean) => void;
    onSpawnParticles: () => void;
    onRandomizeVelocity: () => void;
    onMapReset: () => void;
    onTogglePlay: () => void;

    isPlaying: boolean;
    controlPanelVisible: boolean;

    setMapType: (type: MapType) => void;
    mapType: MapType;
}

export const MainToolbar = connectContext(
    MainToolbarComponent,
    ({ state, actions }) => ({
        setMapType: actions.setMapType,
        mapType: state.settings.mapType,
    })
);

function MainToolbarComponent({
    onToggleControlPanel,
    controlPanelVisible,
    onSpawnParticles,
    onRandomizeVelocity,
    onMapReset,
    onTogglePlay,
    isPlaying,

    setMapType,
    mapType,
}: Props) {
    return (
        <Toolbar>
            <ToolbarButton onClick={onMapReset} title="Reset map">
                <i className="fa fa-undo" />
            </ToolbarButton>
            <ToolbarButton
                onClick={onRandomizeVelocity}
                title="Randomize velocity field"
            >
                <i className="fa fa-random" />
            </ToolbarButton>
            <ToolbarButton
                onClick={onSpawnParticles}
                title="Spawn 5k particles"
            >
                <i className="fa fa-ravelry" />
            </ToolbarButton>
            <ToolbarButton onClick={onTogglePlay} title="Play/pause animation">
                <i className={'fa fa-' + (isPlaying ? 'pause' : 'play')} />
            </ToolbarButton>

            <ToolbarSeparator />

            <ToolbarButton
                active={mapType === MapType.Pressure}
                onClick={() => setMapType(MapType.Pressure)}
            >
                Pressure
            </ToolbarButton>
            <ToolbarButton
                active={mapType === MapType.Neutral}
                onClick={() => setMapType(MapType.Neutral)}
            >
                Neutral
            </ToolbarButton>
            <ToolbarButton
                active={mapType === MapType.Velocity}
                onClick={() => setMapType(MapType.Velocity)}
            >
                Velocity
            </ToolbarButton>
            <ToolbarButton
                active={mapType === MapType.Divergence}
                onClick={() => setMapType(MapType.Divergence)}
            >
                Divergence
            </ToolbarButton>

            <ToolbarSeparator />

            <ToolbarButton
                onClick={() => onToggleControlPanel(!controlPanelVisible)}
                title="Show control panel"
                active={controlPanelVisible}
            >
                <i className="fa fa-bar-chart" />
            </ToolbarButton>
        </Toolbar>
    );
}
