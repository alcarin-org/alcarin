import React, { useEffect, useRef } from 'react';

import { useCanvas } from './utils/CanvasUtils';
import { Point } from '../../utils/Math';
import { MACGridData } from '../../data/atmosphere/MACGrid';

interface Props {
    particles: Point[];
    atmo: MACGridData;

    width: number;
    height: number;
}

const HtmlParticleColors = ['#0074D9', '#FF4136'];

export function ParticlesRenderer({ atmo, particles, width, height }: Props) {
    const domCanvasRef = useRef<HTMLCanvasElement>(null);
    const [, displayCtxRef] = useCanvas(width, height, domCanvasRef);
    const [cellCanvasRef, cellCtxRef] = useCanvas(10, 10);

    useEffect(() => {
        renderParticleTo(cellCtxRef.current!, HtmlParticleColors[0]);
    }, []);

    useEffect(
        () => {
            displayCtxRef.current!.clearRect(0, 0, width, height);
            renderParticles(
                displayCtxRef.current!,
                cellCanvasRef.current!,
                particles,
                width / atmo.size
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

function renderParticles(
    ctx: CanvasRenderingContext2D,
    cellCanvas: CanvasImageSource,
    particles: Point[],
    fieldSizePx: number
) {
    particles.forEach(([x, y]) => {
        const offset = [(x + 0.5) * fieldSizePx, (y + 0.5) * fieldSizePx];

        ctx.drawImage(cellCanvas, offset[0] - 4, offset[1] - 4);
    });
}

function renderParticleTo(
    ctx: CanvasRenderingContext2D,
    particleFillColor: string
) {
    ctx.strokeStyle = '#005b80';
    ctx.fillStyle = particleFillColor;
    ctx.translate(5, 5);

    const particleRadius = 4;
    ctx.beginPath();
    ctx.arc(0, 0, particleRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}
