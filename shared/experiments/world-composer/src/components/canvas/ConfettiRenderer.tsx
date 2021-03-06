// tslint:disable no-bitwise
import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../store/rootState';
import { useCanvas } from './utils/CanvasUtils';
import { ParticlesData } from '../../data/convectable/Particles';

interface Props {
    particles: ParticlesData;
    gridSize: number;

    width: number;
    height: number;
}

export const ConfettiRenderer = connect(
    (state: RootState) => ({
        gridSize: state.simulation.grid.size,
        particles: state.simulation.particles,
    })
)(ConfettiRendererComponent);

function ConfettiRendererComponent({
    gridSize,
    particles,
    width,
    height,
}: Props) {
    const domCanvasRef = useRef<HTMLCanvasElement>(null);
    const [, displayCtx] = useCanvas(width, height, domCanvasRef);

    useEffect(
        () => {
            if (displayCtx) {
                displayCtx.clearRect(0, 0, width, height);
                renderConfetti(
                    displayCtx,
                    particles,
                    width / gridSize,
                    width,
                    height
                );
            }
        },
        [displayCtx, particles, gridSize, width, height]
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

function renderConfetti(
    ctx: CanvasRenderingContext2D,
    particles: Props['particles'],
    fieldSizePx: number,
    width: number,
    height: number
) {
    function offsetFromPx(x: number, y: number) {
        return y * width + x;
    }

    const pixelData = ctx.getImageData(0, 0, width, height);
    const data = new Uint32Array(pixelData.data.buffer);
    for (let i = 0; i < particles.count; i++) {
        const i2 = 2 * i;
        const pos = particles.positions.slice(i2, i2 + 2);
        const pxPos = [
            Math.floor((pos[0] + 0.5) * fieldSizePx),
            Math.floor((pos[1] + 0.5) * fieldSizePx),
        ];
        const color = particles.colors[i];
        // set alpha for color
        const blendColor = (color & 0x00ffffff) | (120 << 24);

        const offset = offsetFromPx(pxPos[0], pxPos[1]);
        data[offset] = color;

        data[offset - 1] = blendColor;
        data[offset - 2] = blendColor;
        data[offset + 1] = blendColor;
        data[offset + 2] = blendColor;

        data[offset - width] = blendColor;
        data[offset - 2 * width] = blendColor;
        data[offset - width - 1] = blendColor;
        data[offset - width + 1] = blendColor;

        data[offset + width] = blendColor;
        data[offset + 2 * width] = blendColor;
        data[offset + width - 1] = blendColor;
        data[offset + width + 1] = blendColor;
    }
    ctx.putImageData(pixelData, 0, 0);
}
