import React, { useEffect, useRef, useState, useContext } from 'react';

import { BackgroundRenderer } from './background/BackgroundRenderer';
import { SolidBackground } from './background/SolidBackground';
import { VelocityFieldRenderer } from './VelocityFieldRenderer';
// import { ParticlesRenderer } from './ParticlesRenderer';
import { ConfettiRenderer } from './ConfettiRenderer';
import { MapType } from './utils/CanvasUtils';
import { ParticlesEngine } from '../../data/engine/ParticlesEngine';
import Context from '../SimulationContext';

interface Props {
    particlesEngine: ParticlesEngine;
    fieldSizePx?: number;
    mapType: MapType;
    onRender?: (deltaTime: DOMHighResTimeStamp) => void;
}

export function MapRenderer({
    fieldSizePx = 30,
    mapType = MapType.Pressure,
    onRender,
    particlesEngine,
}: Props) {
    const { grid, engine } = useContext(Context)!;

    const canvasSizePx = fieldSizePx * grid.size;

    const lastRenderRef = useRef<DOMHighResTimeStamp | null>(null);
    // temporary solution, entire rendering mechanism will be refactored soon
    const [, setRenderCount] = useState(0);

    useEffect(
        () => {
            let requestAnimFrameId = requestAnimationFrame(renderAtmosphere);

            function renderAtmosphere(timestamp: DOMHighResTimeStamp) {
                if (lastRenderRef.current !== null) {
                    const deltaTime = timestamp - lastRenderRef.current;
                    if (onRender) {
                        onRender(deltaTime);
                    }
                }
                // this force rerender
                setRenderCount(prev => prev + 1);
                lastRenderRef.current = timestamp;
                requestAnimFrameId = requestAnimationFrame(renderAtmosphere);
            }

            return () => cancelAnimationFrame(requestAnimFrameId);
        },
        [onRender]
    );

    return (
        <div
            className="map-renderer"
            style={{ width: canvasSizePx, height: canvasSizePx }}
        >
            <BackgroundRenderer
                atmo={grid}
                driver={engine}
                width={canvasSizePx}
                height={canvasSizePx}
                mapType={mapType}
            />
            <SolidBackground
                solids={grid.solids}
                canvasWidth={canvasSizePx}
                canvasHeight={canvasSizePx}
                bgWidth={grid.size}
                bgHeight={grid.size}
            />
            {mapType !== MapType.Neutral && (
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
                    particles={particlesEngine.particles}
                />
            )}
        </div>
    );
}
