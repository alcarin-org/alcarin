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
        console.log('render');
        const ctx: CanvasRenderingContext2D = canvasRef.current!.getContext(
            '2d'
        )!;
        ctx.fillStyle = 'yellow';
        ctx.fillRect(0, 0, canvasSizePx, canvasSizePx);
        ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${
            currentColor.b
        })`;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.translate(
            (atmosphere.worldRadius - 1) * fieldSizePx,
            (atmosphere.worldRadius - 1) * fieldSizePx
        );
        const visibleCellSize = fieldSizePx - 2 * gapsPx;
        const fieldHalfSizePx = fieldSizePx / 2;
        const center: Point = { x: 0, y: 0 };

        atmosphere.data.forEach((column, arrX) =>
            column.forEach((entry, arrY) => {
                const pos = {
                    x: arrX - atmosphere.worldRadius + 1,
                    y: arrY - atmosphere.worldRadius + 1,
                };

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
            })
        );
    });
    useEffect(() => {
        setTimeout(() => setColor({ r: 0, g: 0, b: currentColor.b + 10 }), 100);
    });

    return (
        <canvas ref={canvasRef} width={canvasSizePx} height={canvasSizePx} />
    );
}
