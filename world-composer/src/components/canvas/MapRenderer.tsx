import React, {
    useRef,
    useEffect,
    // useState,
    // MouseEventHandler,
    // RefObject,
} from 'react';

import { BackgroundRenderer } from './background/BackgroundRenderer';
import { SolidBackground } from './background/SolidBackground';
import { VelocityFieldRenderer } from './VelocityFieldRenderer';
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
    atmosphere: Atmosphere;
    atmoDriver: VelocityDrivenAtmo;
    fieldSizePx?: number;
    mapType: MapType;
}

export default function MapRenderer({
    atmosphere,
    atmoDriver,
    fieldSizePx = 30,
    mapType = MapType.Pressure,
}: Props) {
    const atmo = atmosphere;
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasSizePx = fieldSizePx * atmo.size;

    // const [screenCanvasRef, screenCtxRef] = useCanvas(
    //     canvasSizePx,
    //     canvasSizePx,
    //     displayCanvasRef
    // );

    useEffect(() => {
        function renderAtmosphere() {
            // const screenCtx = screenCtxRef.current!;
        }

        const requestId = requestAnimationFrame(renderAtmosphere);

        return () => cancelAnimationFrame(requestId);
    });

    return (
        <div className="map-renderer">
            <BackgroundRenderer
                atmo={atmo}
                driver={atmoDriver}
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
            <VelocityFieldRenderer
                atmo={atmo}
                driver={atmoDriver}
                width={canvasSizePx}
                height={canvasSizePx}
            />
            <canvas
                ref={displayCanvasRef}
                width={canvasSizePx}
                height={canvasSizePx}
            />
        </div>
    );
}
