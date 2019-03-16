import React from 'react';

import { Toolbar, ToolbarButton, ToolbarSeparator } from './common/Toolbar';
import { useInteractionContext } from '../context/InteractionContext';
import { MapType } from '../context/interaction/state';
import { ActionType } from '../context/interaction/reducer';

interface Props {
    onToggleControlPanel: (visible: boolean) => void;
    onSpawnParticles: () => void;
    onRandomizeVelocity: () => void;
    onMapReset: () => void;

    controlPanelVisible: boolean;
}

function changeMapTypeAction(mapType: MapType) {
    return {
        type: ActionType.SetMapType,
        payload: mapType,
    };
}

export function MainToolbar({
    onToggleControlPanel,
    controlPanelVisible,
    onSpawnParticles,
    onRandomizeVelocity,
    onMapReset,
}: Props) {
    const {
        state: {
            settings: { mapType },
        },
        dispatch,
    } = useInteractionContext();
    const dispachNewMapType = (mapType: MapType) =>
        dispatch(changeMapTypeAction(mapType));

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

            <ToolbarSeparator />

            <ToolbarButton
                active={mapType === MapType.Pressure}
                onClick={() => dispachNewMapType(MapType.Pressure)}
                disabled={true}
            >
                Pressure
            </ToolbarButton>
            <ToolbarButton
                active={mapType === MapType.Neutral}
                onClick={() => dispachNewMapType(MapType.Neutral)}
            >
                Neutral
            </ToolbarButton>
            <ToolbarButton
                active={mapType === MapType.Velocity}
                onClick={() => dispachNewMapType(MapType.Velocity)}
            >
                Velocity
            </ToolbarButton>
            <ToolbarButton
                active={mapType === MapType.Divergence}
                onClick={() => dispachNewMapType(MapType.Divergence)}
            >
                Divergence
            </ToolbarButton>
            <ToolbarButton
                active={mapType === MapType.Wall}
                onClick={() => dispachNewMapType(MapType.Wall)}
            >
                Wall
            </ToolbarButton>

            <ToolbarSeparator />

            <ToolbarButton
                onClick={() => onToggleControlPanel(!controlPanelVisible)}
                title="Show statistics"
                active={controlPanelVisible}
            >
                <i className="fa fa-bar-chart" />
            </ToolbarButton>
        </Toolbar>
    );
}
