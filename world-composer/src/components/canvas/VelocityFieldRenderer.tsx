import React, { useEffect, useRef } from 'react';

import { useCanvas } from './utils/CanvasUtils';
// import { DataContainer } from '../../utils/Immutable';
import { Point, multiply, clamp, magnitude, normalize } from '../../utils/Math';
import { Atmosphere } from '../../data/Atmosphere';
import { VelocityDrivenAtmo } from '../../data/VelocityDrivenAtmo';

// type VectorField = Vector[];

interface Props {
    atmo: Atmosphere;
    driver: VelocityDrivenAtmo;

    width: number;
    height: number;
}

export function VelocityFieldRenderer({ atmo, driver, width, height }: Props) {
    const domCanvasRef = useRef<HTMLCanvasElement>(null);
    const [, displayCtxRef] = useCanvas(width, height, domCanvasRef);
    // const [velocityFieldContainer, setVelocityFieldContainer] = useState<
    //     DataContainer<VectorField>
    // >();

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
    atmo: Atmosphere,
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
            const ind = atmo.index([i, j]);
            if (atmo.solidsVector[ind] === 1) {
                continue;
            }
            const vel = atmo.interpolateVelocity([i, j]);
            const offset = [(i + 0.5) * fieldSizePx, (j + 0.5) * fieldSizePx];
            const vPower = clamp(0.1, 1, magnitude(vel));
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
