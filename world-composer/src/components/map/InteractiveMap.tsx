import './InteractiveMap.scss';

import React from 'react';

import { round, Point } from '../../utils/Math';
import { isBufferWall } from '../../data/atmosphere/MACGrid';
import { FluidSource } from '../../data/engine/FluidSourcesEngine';
import { MapRenderer } from '../canvas/MapRenderer';
import {
    connectContext,
    SimulationContextType,
} from '../../context/SimulationContext';
import { MapMode } from '../../context/state';

export const InteractiveMap = connectContext(
    InteractiveMapComponent,
    ({ state, actions }) => ({
        interaction: state.settings.mapInteraction,
        drawFieldSize: state.settings.drawFieldSize,
        gridSize: state.simulation.grid.size,

        toggleSolid: actions.toggleSolid,
        removeSourcesAt: actions.removeSourcesAt,
        registerSource: actions.registerSource,
    })
);

interface Props {
    interaction: SimulationContextType['state']['settings']['mapInteraction'];
    drawFieldSize: number;
    gridSize: number;

    toggleSolid: (gridPos: Point, solidNewState: boolean) => void;
    removeSourcesAt: (gridPos: Point) => void;
    registerSource: (source: FluidSource) => void;
}

function InteractiveMapComponent({
    interaction,
    drawFieldSize,
    gridSize,

    toggleSolid,
    removeSourcesAt,
    registerSource,
}: Props) {
    function eventToMapPosition(ev: React.MouseEvent<HTMLDivElement>) {
        return [
            ev.nativeEvent.offsetX / drawFieldSize - 0.5,
            ev.nativeEvent.offsetY / drawFieldSize - 0.5,
        ] as Point;
    }

    function onMouseMove(ev: React.MouseEvent<HTMLDivElement>) {
        onMapContainerDown(ev);
    }

    function onMapContainerDown(ev: React.MouseEvent<HTMLDivElement>) {
        if (ev.buttons === 0) {
            return;
        }
        const mapPos = eventToMapPosition(ev);
        if (isBufferWall(gridSize, round(mapPos))) {
            return;
        }

        const gridPos = round(mapPos);
        const leftButton = ev.buttons === 1;

        switch (interaction.mode) {
            case MapMode.WallEditor:
                toggleSolid(gridPos, leftButton);
                break;
            case MapMode.SourcesAndSinks:
                removeSourcesAt(gridPos);
                if (leftButton) {
                    const source: FluidSource = {
                        ...(interaction.data as FluidSource),
                        gridPosition: gridPos,
                    };
                    registerSource(source);
                }
                break;
        }
    }

    const showPointer = interaction.mode !== MapMode.Neutral;
    return (
        <div
            className={
                'interactive-map' +
                (showPointer ? ' interactive-map--active' : '')
            }
            onMouseDown={onMapContainerDown}
            onMouseMove={onMouseMove}
        >
            <MapRenderer />
        </div>
    );
}
