import React from 'react';
import { connect } from 'react-redux';

import { Toolbar, ToolbarButton, ToolbarSeparator } from './common/Toolbar';
import { MapType } from '../store/reducers/settings/state';
import actions from '../store/reducers/settings/actions';
import { RootState } from '../store/rootState';

interface Props {
    onToggleControlPanel: (visible: boolean) => void;
    onSpawnParticles: () => void;
    onRandomizeVelocity: () => void;
    onMapReset: () => void;
    onTogglePlay: () => void;

    isPlaying: boolean;
    controlPanelVisible: boolean;

    setMapType: (type: MapType) => void;
    increaseMapView: () => void;
    decreaseMapView: () => void;
    mapType: MapType;
}

export const MainToolbar = connect(
    (state: RootState) => ({
        mapType: state.simulation.settings.mapType,
    }),
    {
        setMapType: actions.setMapType,
        increaseMapView: actions.increaseMapView,
        decreaseMapView: actions.decreaseMapView,
    }
)(MainToolbarComponent);

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
    increaseMapView,
    decreaseMapView,
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

            <select
                value={mapType}
                title="Map type"
                onChange={ev =>
                    setMapType(parseInt(ev.target.value, 10) as MapType)
                }
            >
                <option value={MapType.Neutral}>Neutral</option>
                <option value={MapType.Velocity}>Velocity</option>
                <option value={MapType.Pressure}>Pressure</option>
            </select>

            <ToolbarButton onClick={decreaseMapView} title="Zoom in">
                <i className="fa fa-search-plus" />
            </ToolbarButton>
            <ToolbarButton onClick={increaseMapView} title="Zoom out">
                <i className="fa fa-search-minus" />
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
