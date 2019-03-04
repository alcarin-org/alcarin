import React, { useEffect, useRef } from 'react';

import { useCanvas } from './utils/CanvasUtils';
// import { DataContainer } from '../../utils/Immutable';
import { Point, multiply, clamp, magnitude, normalize } from '../../utils/Math';
import {
    MACGridData,
    index,
    interpolateVelocity,
} from '../../data/atmosphere/MACGrid';
import { AtmosphereEngine } from '../../data/engine/AtmosphereEngine';

// type VectorField = Vector[];

interface Props {
    atmo: MACGridData;
    driver: AtmosphereEngine;

    width: number;
    height: number;
}

const VelocityDrawFactor = 1.3;

export function VelocityFieldRenderer({ atmo, driver, width, height }: Props) {
    const domCanvasRef = useRef<HTMLCanvasElement>(null);
    const [, displayCtxRef] = useCanvas(width, height, domCanvasRef);

    useEffect(
        () => {
            renderVelocities(displayCtxRef.current!, atmo, width / atmo.size);
        },
        [driver.step]
    );

    return (
        <canvas
            id="velocity-field-canvas"
            width={width}
            height={height}
            ref={domCanvasRef}
        />
    );
}

export function renderVelocities(
    ctx: CanvasRenderingContext2D,
    atmo: MACGridData,
    fieldSizePx: number
) {
    function drawVectorFromTo(from: Point, to: Point) {
        ctx.moveTo(from[0], from[1]);
        ctx.lineTo(to[0], to[1]);

        ctx.fillRect(to[0] - 2, to[1] - 2, 4, 4);
    }

    ctx.clearRect(0, 0, fieldSizePx * atmo.size, fieldSizePx * atmo.size);
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    for (let i = 0; i < atmo.size; i++) {
        for (let j = 0; j < atmo.size; j++) {
            const ind = index(atmo, [i, j]);
            if (atmo.solids[ind] === 1) {
                continue;
            }
            const vel = interpolateVelocity(atmo, [i, j]);
            const offset = [(i + 0.5) * fieldSizePx, (j + 0.5) * fieldSizePx];
            const vPower = clamp(0.1, 1, magnitude(vel) * VelocityDrawFactor);
            const vNorm = normalize(vel);
            const v = multiply(vNorm, 0.85 * fieldSizePx * vPower);
            drawVectorFromTo(
                [offset[0] + -0.5 * v[0], offset[1] + -0.5 * v[1]],
                [offset[0] + 0.5 * v[0], offset[1] + 0.5 * v[1]]
            );
        }
    }
    ctx.stroke();
}
