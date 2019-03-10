import React from 'react';

import { Toolbar, ToolbarButton, ToolbarSeparator } from './common/Toolbar';
import { MapType } from './canvas/utils/CanvasUtils';
import { MapSettings } from './map/InteractiveMap';

interface Props {
    onToggleStats: (visible: boolean) => void;
    onMapTypeChange: (mapType: MapType) => void;
    onSpawnParticles: () => void;
    onRandomizeVelocity: () => void;
    onMapReset: () => void;

    statsVisible: boolean;
    mapSettings: MapSettings;
}

export function MainToolbar({
    onMapTypeChange,
    onToggleStats,
    statsVisible,
    onSpawnParticles,
    mapSettings,
    onRandomizeVelocity,
    onMapReset,
}: Props) {
    return (
        <Toolbar>
            <ToolbarButton
                onClick={onMapReset}
                title="Reset map"
            >
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

            <ToolbarSeparator />

            <ToolbarButton
                active={mapSettings.mapType === MapType.Pressure}
                onClick={() => onMapTypeChange(MapType.Pressure)}
                disabled={true}
            >
                Pressure
            </ToolbarButton>
            <ToolbarButton
                active={mapSettings.mapType === MapType.Neutral}
                onClick={() => onMapTypeChange(MapType.Neutral)}
            >
                Neutral
            </ToolbarButton>
            <ToolbarButton
                active={mapSettings.mapType === MapType.Velocity}
                onClick={() => onMapTypeChange(MapType.Velocity)}
            >
                Velocity
            </ToolbarButton>
            <ToolbarButton
                active={mapSettings.mapType === MapType.Divergence}
                onClick={() => onMapTypeChange(MapType.Divergence)}
            >
                Divergence
            </ToolbarButton>
            <ToolbarButton
                active={mapSettings.mapType === MapType.Wall}
                onClick={() => onMapTypeChange(MapType.Wall)}
            >
                Wall
            </ToolbarButton>

            <ToolbarSeparator />

            <ToolbarButton
                onClick={() => onToggleStats(!statsVisible)}
                title="Show statistics"
                active={statsVisible}
            >
                <i className="fa fa-bar-chart" />
            </ToolbarButton>
        </Toolbar>
    );
}
