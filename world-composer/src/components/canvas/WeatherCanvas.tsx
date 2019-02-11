import React, { useRef, useEffect, useState } from 'react';

import { Atmosphere } from '../../utils/AtmosphereData';
import { Point, distance } from '../../utils/Math';

interface Props {
    atmosphere: Atmosphere;
    fieldSizePx?: number;
    gapsPx?: number;
    circle?: boolean;
}

export default function WeatherCanvas({
    atmosphere,
    fieldSizePx = 30,
    gapsPx = 0,
    circle = true,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasSizePx = (2 * atmosphere.worldRadius - 1) * fieldSizePx;
    const [currentColor, setColor] = useState({ r: 0, g: 0, b: 0 });

    useEffect(() => {
        function renderAtmosphere() {
            const ctx: CanvasRenderingContext2D = canvasRef.current!.getContext(
                '2d'
            )!;
            ctx.fillStyle = `rgb(${(currentColor.r % 512) -
                255}, ${(currentColor.g % 512) - 255}, ${Math.abs(
                (currentColor.b % 512) - 255
            )})`;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(
                (atmosphere.worldRadius - 1) * fieldSizePx,
                (atmosphere.worldRadius - 1) * fieldSizePx
            );
            const visibleCellSize = fieldSizePx - 2 * gapsPx;
            const fieldHalfSizePx = fieldSizePx / 2;
            const center: Point = { x: 0, y: 0 };

            atmosphere.forEach((node, pos) => {
                // we render only cells inside circle.
                // 0.5 is just for nicer graphic effect
                if (distance(center, pos) > atmosphere.worldRadius - 1 + 0.5) {
                    return;
                }
                ctx.fillRect(
                    pos.x * fieldSizePx + gapsPx,
                    pos.y * fieldSizePx + gapsPx,
                    visibleCellSize,
                    visibleCellSize
                );
            });

            setColor({
                r: currentColor.r + 3,
                g: 0,
                b: currentColor.b + 7,
            });
        }
        requestAnimationFrame(renderAtmosphere);
    });

    return (
        <canvas ref={canvasRef} width={canvasSizePx} height={canvasSizePx} />
    );
}
