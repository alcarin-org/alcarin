import React, { useRef, useEffect, useState, MouseEventHandler } from 'react';
import math from 'mathjs';

import * as Atmo from '../../data/AtmosphereData';
import { Point, Vector, angle, constraints } from '../../utils/Math';

interface Props {
    atmosphere: Atmo.Atmosphere;
    fieldSizePx?: number;
    gapsPx?: number;
    circle?: boolean;
    centrifugalMagnitudeMod: number;
    coriolisMagnitudeMod: number;
    onClick: MouseEventHandler<HTMLCanvasElement>;
}

function drawVelocity(
    ctx: CanvasRenderingContext2D,
    // 0..1
    velocity: Vector,
    pos: Point,
    fieldSizePx: number,
    color: string = 'black'
) {
    const halfSize = fieldSizePx / 2 - 1;
    const vPower = constraints(0.1, 1, math.norm(velocity) as number);
    const vAngle = angle(velocity);

    ctx.save();

    ctx.translate(
        pos[0] * fieldSizePx + fieldSizePx / 2,
        pos[1] * fieldSizePx + fieldSizePx / 2
    );
    ctx.rotate(vAngle);
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(-halfSize * vPower, -halfSize + 1);
    ctx.lineTo(-halfSize * vPower, halfSize - 1);
    ctx.lineTo(halfSize * vPower, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'red';
    ctx.fillRect(halfSize * vPower - 1, -1, 2, 2);

    ctx.restore();
}

export default function WeatherCanvas({
    atmosphere,
    fieldSizePx = 30,
    gapsPx = 0,
    circle = true,
    centrifugalMagnitudeMod = 0,
    coriolisMagnitudeMod = 0.1,
    onClick,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasSizePx = (2 * atmosphere.radius - 1) * fieldSizePx;
    const worldColor = 'blue';
    const bgColor = 'silver';
    const [i, forceRerender] = useState(0);
    useEffect(() => {
        requestAnimationFrame(renderAtmosphere);

        function renderAtmosphere() {
            if (!canvasRef.current) {
                return;
            }
            const ctx: CanvasRenderingContext2D = canvasRef.current.getContext(
                '2d'
            )!;
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.translate(
                (atmosphere.radius - 1) * fieldSizePx,
                (atmosphere.radius - 1) * fieldSizePx
            );
            const visibleCellSize = fieldSizePx - 2 * gapsPx;
            const fieldHalfSizePx = fieldSizePx / 2;
            const center: Point = [0, 0];

            Atmo.forEach(atmosphere, (node, pos) => {
                // we render only cells inside circle.
                // 0.5 is just for nicer graphic effect
                const isOutside = !Atmo.isInRadius(atmosphere, pos);
                ctx.fillStyle = isOutside ? bgColor : worldColor;
                ctx.fillRect(
                    pos[0] * fieldSizePx + gapsPx,
                    pos[1] * fieldSizePx + gapsPx,
                    visibleCellSize,
                    visibleCellSize
                );
                drawVelocity(ctx, node.velocity, pos, fieldSizePx);
            });
            drawVelocity(
                ctx,
                Atmo.get(atmosphere, center).velocity,
                center,
                fieldSizePx,
                'yellow'
            );
        }
    });

    return (
        <canvas
            onClick={onClick}
            ref={canvasRef}
            width={canvasSizePx}
            height={canvasSizePx}
        />
    );
}
