import React, { useEffect, useRef } from 'react';

import { useCanvas } from './utils/CanvasUtils';
import { Color } from '../../utils/Draw';
import {
    Point,
    multiply,
    clamp,
    magnitude,
    normalize,
    round,
} from '../../utils/Math';
import { Particles } from '../../data/convectable/Particles';
import { Atmosphere } from '../../data/Atmosphere';

interface Props {
    particles: Particles;
    atmo: Atmosphere;

    width: number;
    height: number;
}

export function ConfettiRenderer({ atmo, particles, width, height }: Props) {
    const domCanvasRef = useRef<HTMLCanvasElement>(null);
    const [, displayCtxRef] = useCanvas(width, height, domCanvasRef);
    const [cellCanvasRef, cellCtxRef] = useCanvas(10, 10);

    useEffect(
        () => {
            displayCtxRef.current!.clearRect(0, 0, width, height);
            renderConfetti(
                displayCtxRef.current!,
                particles,
                width / atmo.size,
                width,
                height
            );
        },
        [particles]
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
    function pxFromCoords(x: number, y: number) {
        return [
            Math.floor((x + 0.5) * fieldSizePx),
            Math.floor((y + 0.5) * fieldSizePx),
        ];
    }
    function offsetFromPx(x: number, y: number) {
        return (y * width + x) * 4;
    }

    const pixelData = ctx.getImageData(0, 0, width, height);

    function condHalfColor(pX: number, pY: number, color: Uint8ClampedArray) {
        const offset = offsetFromPx(pX, pY);
        if (pixelData.data[offset + 3] === 0) {
            color[3] = 128;
            pixelData.data.set(color, offset);
        }
    }

    for (let i = 0; i < particles.positions.length / 2; i++) {
        const i2 = 2 * i;
        const i4 = 4 * i;
        const pos = particles.positions.slice(i2, i2 + 2);
        const pxPos = pxFromCoords(pos[0], pos[1]);
        const color = particles.colors.slice(i4, i4 + 4);

        const offset = offsetFromPx(pxPos[0], pxPos[1]);
        pixelData.data.set(color, offset);
        condHalfColor(pxPos[0], pxPos[1] - 1, color);
        condHalfColor(pxPos[0], pxPos[1] + 1, color);
        condHalfColor(pxPos[0] - 1, pxPos[1], color);
        condHalfColor(pxPos[0] + 1, pxPos[1], color);
        condHalfColor(pxPos[0] - 1, pxPos[1] - 1, color);
        condHalfColor(pxPos[0] + 1, pxPos[1] - 1, color);
        condHalfColor(pxPos[0] - 1, pxPos[1] + 1, color);
        condHalfColor(pxPos[0] + 1, pxPos[1] + 1, color);
        // ctx.drawImage(cellCanvas, offset[0] - 4, offset[1] - 4);
    }
    ctx.putImageData(pixelData, 0, 0);
}
