import React, {
    useEffect,
    useState,
    useRef,
    // MouseEventHandler,
    // RefObject,
} from 'react';

import { BackgroundRenderer } from './background/BackgroundRenderer';
import { SolidBackground } from './background/SolidBackground';
import { VelocityFieldRenderer } from './VelocityFieldRenderer';
import { ParticlesRenderer } from './ParticlesRenderer';
import { MapType } from './utils/CanvasUtils';
import { Atmosphere } from '../../data/Atmosphere';
import { VelocityDrivenAtmo } from '../../data/VelocityDrivenAtmo';
// import {
//     Point,
//     Vector,
//     normalize,
//     multiply,
//     round,
//     add,
//     floor,
// } from '../../utils/Math';

interface Props {
    atmo: Atmosphere;
    driver: VelocityDrivenAtmo;
    fieldSizePx?: number;
    mapType: MapType;
    onRender?: (deltaTime: DOMHighResTimeStamp) => void;
}

export function MapRenderer({
    atmo,
    driver,
    fieldSizePx = 30,
    mapType = MapType.Pressure,
    onRender,
}: Props) {
    const canvasSizePx = fieldSizePx * atmo.size;

    const lastRenderRef = useRef<DOMHighResTimeStamp | null>(null);
    // temporary solution, the atmo/driver system waiting for refactor
    const [renderCounter, setRenderCount] = useState(0);

    useEffect(() => {
        const requestAnimFrameId = requestAnimationFrame(renderAtmosphere);

        function renderAtmosphere(timestamp: DOMHighResTimeStamp) {
            if (lastRenderRef.current !== null) {
                const deltaTime = timestamp - lastRenderRef.current;
                if (onRender) {
                    onRender(deltaTime);
                }
            }
            // this force rerender
            setRenderCount(renderCounter + 1);
            lastRenderRef.current = timestamp;
        }

        return () => cancelAnimationFrame(requestAnimFrameId);
    });

    return (
        <div
            className="map-renderer"
            style={{ width: canvasSizePx, height: canvasSizePx }}
        >
            <BackgroundRenderer
                atmo={atmo}
                driver={driver}
                width={canvasSizePx}
                height={canvasSizePx}
                mapType={mapType}
            />
            <SolidBackground
                solids={atmo.solidsVector}
                canvasWidth={canvasSizePx}
                canvasHeight={canvasSizePx}
                bgWidth={atmo.size}
                bgHeight={atmo.size}
            />
            {mapType !== MapType.Neutral && (
                <VelocityFieldRenderer
                    atmo={atmo}
                    driver={driver}
                    width={canvasSizePx}
                    height={canvasSizePx}
                />
            )}
            {mapType === MapType.Neutral && (
                <ParticlesRenderer
                    width={canvasSizePx}
                    height={canvasSizePx}
                    atmo={atmo}
                    particles={driver.particles}
                />
            )}
        </div>
    );
}
