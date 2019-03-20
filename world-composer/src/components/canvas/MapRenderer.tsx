import React, { useEffect, useState } from 'react';

import { connectContext } from '../../context/SimulationContext';
import { MapType } from '../../context/state';
import { BackgroundRenderer } from './background/BackgroundRenderer';
import { SolidBackground } from './background/SolidBackground';
import { VelocityFieldRenderer } from './VelocityFieldRenderer';
import { ConfettiRenderer } from './ConfettiRenderer';
import GlobalTimer from '../../utils/Timer';

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

    // temporary solution, entire rendering mechanism will be refactored soon
    const [, setRenderCount] = useState(0);
    useEffect(() => {
        function rerender(timestamp: DOMHighResTimeStamp) {
            // this force rerender
            setRenderCount(prev => prev + 1);
        }
        return GlobalTimer.onTick(rerender);
    }, []);

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
