import './InteractiveMap.scss';

import React, { useContext } from 'react';

import { round, Point } from '../../utils/Math';
import { isBufferWall } from '../../data/atmosphere/MACGrid';
import { FluidSource } from '../../data/engine/FluidSourcesEngine';
import { MapRenderer } from '../canvas/MapRenderer';
import SimulationContext from '../../context/SimulationContext';
import { useInteractionContext } from '../../context/InteractionContext';
import { MapMode } from '../../context/interaction/state';

export interface MapStats {
    renderFps: number;
}

export function InteractiveMap() {
    const { grid, engine, sources } = useContext(SimulationContext);
    const {
        state: { settings },
    } = useInteractionContext();

    function eventToMapPosition(ev: React.MouseEvent<HTMLDivElement>) {
        return [
            ev.nativeEvent.offsetX / settings.drawFieldSize - 0.5,
            ev.nativeEvent.offsetY / settings.drawFieldSize - 0.5,
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
        if (isBufferWall(grid.size, round(mapPos))) {
            return;
        }

        const gridPos = round(mapPos);
        const leftButton = ev.buttons === 1;

        switch (settings.mapInteraction.mode) {
            case MapMode.WallEditor:
                engine.toggleSolid(gridPos, leftButton);
                break;
            case MapMode.SourcesAndSinks:
                sources.removeSourcesAt(gridPos);
                if (leftButton) {
                    const source: FluidSource = {
                        ...(settings.mapInteraction.data as FluidSource),
                        gridPosition: gridPos,
                    };
                    sources.registerSource(source);
                }
                break;
        }
    }

    const showPointer = settings.mapInteraction.mode !== MapMode.Neutral;
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
