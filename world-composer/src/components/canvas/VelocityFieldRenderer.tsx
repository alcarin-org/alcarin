import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { useCanvas } from './utils/CanvasUtils';
import { Point, multiply, clamp, magnitude, normalize } from '../../utils/Math';
import { RootState } from '../../store/rootState';
import {
    MACGridData,
    index,
    interpolateVelocity,
} from '../../data/atmosphere/MACGrid';

interface Props {
    grid: MACGridData;

    width: number;
    height: number;
}

const VelocityDrawFactor = 1.3;

export const VelocityFieldRenderer = connect((state: RootState) => ({
    grid: state.simulation.grid,
}))(VelocityFieldRendererComponent);

function VelocityFieldRendererComponent({ grid, width, height }: Props) {
    const domCanvasRef = useRef<HTMLCanvasElement>(null);
    const [, displayCtx] = useCanvas(width, height, domCanvasRef);

    useEffect(
        () => {
            if (displayCtx) {
                renderVelocities(displayCtx, grid, width / grid.size);
            }
        },
        [displayCtx, grid, width]
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
    grid: MACGridData,
    fieldSizePx: number
) {
    function drawVectorFromTo(from: Point, to: Point) {
        ctx.moveTo(from[0], from[1]);
        ctx.lineTo(to[0], to[1]);

        ctx.fillRect(to[0] - 2, to[1] - 2, 4, 4);
    }

    ctx.clearRect(0, 0, fieldSizePx * grid.size, fieldSizePx * grid.size);
    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    for (let i = 0; i < grid.size; i++) {
        for (let j = 0; j < grid.size; j++) {
            const ind = index(grid, [i, j]);
            if (grid.solids[ind] === 1) {
                continue;
            }
            const vel = interpolateVelocity(grid, [i, j]);
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
