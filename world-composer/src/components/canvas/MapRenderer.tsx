import React from 'react';

import { connectContext } from '../../context/SimulationContext';
import { MapType } from '../../context/state';
import { BackgroundRenderer } from './background/BackgroundRenderer';
import { SolidBackground } from './background/SolidBackground';
import { VelocityFieldRenderer } from './VelocityFieldRenderer';
import { ConfettiRenderer } from './ConfettiRenderer';

interface Props {
    gridSize: number;
    drawFieldSize: number;
    mapType: MapType;
}

export const MapRenderer = connectContext(
    MapRendererComponent,
    ({ state }) => ({
        gridSize: state.simulation.grid.size,
        drawFieldSize: state.settings.drawFieldSize,
        mapType: state.settings.mapType,
    })
);

function MapRendererComponent({ mapType, gridSize, drawFieldSize }: Props) {
    const canvasSizePx = drawFieldSize * gridSize;

    return (
        <div
            className="map-renderer"
            style={{ width: canvasSizePx, height: canvasSizePx }}
        >
            <BackgroundRenderer width={canvasSizePx} height={canvasSizePx} />
            {mapType === MapType.Velocity && (
                <VelocityFieldRenderer
                    width={canvasSizePx}
                    height={canvasSizePx}
                />
            )}
            {mapType === MapType.Neutral && (
                <ConfettiRenderer width={canvasSizePx} height={canvasSizePx} />
            )}
            <SolidBackground
                canvasWidth={canvasSizePx}
                canvasHeight={canvasSizePx}
                bgWidth={gridSize}
                bgHeight={gridSize}
            />
        </div>
    );
}
