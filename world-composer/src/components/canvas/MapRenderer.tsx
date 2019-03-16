import React, { useEffect, useRef, useState, useContext } from 'react';

import SimulationContext from '../../context/SimulationContext';
import { useInteractionContext } from '../../context/InteractionContext';
import { MapType } from '../../context/interaction/state';
import { BackgroundRenderer } from './background/BackgroundRenderer';
import { SolidBackground } from './background/SolidBackground';
import { VelocityFieldRenderer } from './VelocityFieldRenderer';
// import { ParticlesRenderer } from './ParticlesRenderer';
import { ConfettiRenderer } from './ConfettiRenderer';

interface Props {
    fieldSizePx?: number;
    onRender?: (deltaTime: DOMHighResTimeStamp) => void;
}

export function MapRenderer({ fieldSizePx = 30, onRender }: Props) {
    const { grid, engine, particles } = useContext(SimulationContext);
    const {
        state: {
            settings: { mapType },
        },
    } = useInteractionContext();

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
                lastRenderRef.current = timestamp;
                requestAnimFrameId = requestAnimationFrame(renderAtmosphere);
                setRenderCount(prev => prev + 1);
            }

            return () => {
                cancelAnimationFrame(requestAnimFrameId);
            };
        },
        [onRender]
    );

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
            {(mapType === MapType.Neutral || mapType === MapType.Wall) && (
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
