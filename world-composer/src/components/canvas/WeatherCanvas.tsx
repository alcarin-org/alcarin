import React, { useRef, useEffect, useState } from 'react';

import { Atmosphere } from '../../utils/AtmosphereData';
import {
    Point,
    Vector,
    distance,
    angle,
    magnitude,
    constraints,
} from '../../utils/Math';

interface Props {
    atmosphere: Atmosphere;
    fieldSizePx?: number;
    gapsPx?: number;
    circle?: boolean;
}

function drawVelocity(
    ctx: CanvasRenderingContext2D,
    // 0..1
    velocity: Vector,
    pos: Point,
    fieldSizePx: number
) {
    const halfSize = fieldSizePx / 2 - 1;
    const vPower = constraints(0.1, 1, magnitude(velocity));
    const vAngle = angle(velocity);

    ctx.translate(pos.x + fieldSizePx / 2, pos.y + fieldSizePx / 2);
    ctx.rotate(vAngle);
    ctx.fillStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(-halfSize * vPower, -halfSize + 1);
    ctx.lineTo(-halfSize * vPower, halfSize - 1);
    ctx.lineTo(halfSize * vPower, 0);
    ctx.fill();

    ctx.restore();
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
        requestAnimationFrame(renderAtmosphere);

        function renderAtmosphere() {
            if (!canvasRef.current) {
                return;
            }
            const ctx: CanvasRenderingContext2D = canvasRef.current.getContext(
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
            drawVelocity(ctx, { x: -10, y: -5 }, { x: 0, y: 0 }, fieldSizePx);
            setColor({
                r: currentColor.r + 3,
                g: 0,
                b: currentColor.b + 7,
            });
        }
    });

    return (
        <canvas ref={canvasRef} width={canvasSizePx} height={canvasSizePx} />
    );
}
