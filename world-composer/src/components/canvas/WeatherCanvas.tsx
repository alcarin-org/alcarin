import React, { useRef, useEffect, useState, MouseEventHandler } from 'react';
import math from 'mathjs';

import { Atmosphere, AtmosphereNode, NodeType } from '../../data/Atmosphere';
import { Point, Vector, angle, constraints } from '../../utils/Math';

interface Props {
    atmosphere: Atmosphere;
    fieldSizePx?: number;
    gapsPx?: number;
    circle?: boolean;
    centrifugalMagnitudeMod: number;
    coriolisMagnitudeMod: number;
    onClick: MouseEventHandler<HTMLCanvasElement>;
}

const PressureDrawRange = 1.4;

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

            ctx.fillStyle = worldColor;
            atmosphere.forEach((node, pos) => {
                // we render only cells inside circle.
                // 0.5 is just for nicer graphic effect
                drawCell(ctx, atmosphere, pos, fieldSizePx, gapsPx);
                drawVelocity(ctx, node.velocity, pos, fieldSizePx);
            });
            drawVelocity(
                ctx,
                atmosphere.get(center).velocity,
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

function drawVelocity(
    ctx: CanvasRenderingContext2D,
    // 0..1
    velocity: Vector,
    pos: Point,
    fieldSizePx: number,
    color: string = 'rgba(0,0,0, 0.25)'
) {
    return;
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

function drawCell(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere,
    pos: Point,
    fieldSizePx: number,
    gapsPx: number
) {
    const range = fieldSizePx - 2 * gapsPx;
    ctx.fillStyle = cellColor(atmo.get(pos).pressure);
    ctx.fillRect(
        pos[0] * fieldSizePx + gapsPx,
        pos[1] * fieldSizePx + gapsPx,
        fieldSizePx - 2 * gapsPx,
        fieldSizePx - 2 * gapsPx
    );
    // for (let i = gapsPx; i < fieldSizePx - gapsPx; i++) {
    //     for (let j = gapsPx; j < fieldSizePx - gapsPx; j++) {
    // const exactPoint: Point = [pos[0] + i / range, pos[1] + j / range];
    // ctx.fillStyle = cellColor(atmo.interpolatePressure(exactPoint));
    // ctx.fillRect(
    //     pos[0] * fieldSizePx + i,
    //     pos[1] * fieldSizePx + j,
    //     1,
    //     1
    // );
    // }
    // }
}

function cellColor(pressure: number) {
    const factor = (pressure + PressureDrawRange) / (2 * PressureDrawRange);
    const c = [255 * factor, 0, 255 * (1 - factor)];
    return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}
