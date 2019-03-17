import React, { useEffect, useState, useContext } from 'react';

import SimulationContext from '../../context/SimulationContext';
import { useInteractionContext } from '../../context/InteractionContext';
import { MapType } from '../../context/interaction/state';
import { BackgroundRenderer } from './background/BackgroundRenderer';
import { SolidBackground } from './background/SolidBackground';
import { VelocityFieldRenderer } from './VelocityFieldRenderer';
import { ConfettiRenderer } from './ConfettiRenderer';
import GlobalTimer from '../../utils/Timer';

export function MapRenderer() {
    const { grid, engine, particles } = useContext(SimulationContext);
    const {
        state: {
            settings: { mapType, drawFieldSize },
        },
    } = useInteractionContext();

    const canvasSizePx = drawFieldSize * grid.size;

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
            <BackgroundRenderer
                width={canvasSizePx}
                height={canvasSizePx}
                mapType={mapType}
            />
            {mapType === MapType.Velocity && (
                <VelocityFieldRenderer
                    atmo={grid}
                    driver={engine}
                    width={canvasSizePx}
                    height={canvasSizePx}
                />
            )}
            {mapType === MapType.Neutral && (
                <ConfettiRenderer
                    width={canvasSizePx}
                    height={canvasSizePx}
                    atmo={grid}
                    particles={particles.particles}
                />
            )}
            <SolidBackground
                solids={grid.solids}
                canvasWidth={canvasSizePx}
                canvasHeight={canvasSizePx}
                bgWidth={grid.size}
                bgHeight={grid.size}
            />
        </div>
    );
}
