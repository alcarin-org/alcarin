import React, {
    useRef,
    useEffect,
    useState,
    MouseEventHandler,
    RefObject,
} from 'react';

import { renderPressureTexture, renderVelocity } from './primitives';
import { Atmosphere, AtmosphereNode, NodeType } from '../../data/Atmosphere';
import {
    Point,
    Vector,
    angle,
    constraints,
    normalize,
    multiply,
} from '../../utils/Math';

interface Props {
    atmosphere: Atmosphere;
    fieldSizePx?: number;
    onClick: MouseEventHandler<HTMLCanvasElement>;
}

export default function WeatherCanvas({
    atmosphere,
    fieldSizePx = 30,
    onClick,
}: Props) {
    const atmo = atmosphere;
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasSizePx = fieldSizePx * atmo.dim2d;

    const [screenCanvasRef, screenCtxRef] = useCanvas(
        canvasSizePx,
        canvasSizePx,
        displayCanvasRef
    );
    const [pressureCanvasRef, pressureCtxRef] = useCanvas(
        atmo.dim2d,
        atmo.dim2d
    );

    const [cellCanvasRef, cellCtxRef] = useCanvas(fieldSizePx, fieldSizePx);
    const pixelOffset = (atmo.radius - 1) * fieldSizePx;

    useEffect(() => {
        pressureCtxRef.current!.translate(atmo.radius - 1, atmo.radius - 1);
        const halfSize = Math.trunc(fieldSizePx / 2);
        cellCtxRef.current!.translate(halfSize, halfSize);
        cellCtxRef.current!.strokeStyle = 'black';
    }, []);

    useEffect(() => {
        function renderAtmosphere() {
            const screenCtx = screenCtxRef.current!;

            renderPressureTexture(pressureCtxRef.current!, atmo);
            screenCtx.drawImage(
                pressureCanvasRef.current!,
                0,
                0,
                canvasSizePx,
                canvasSizePx
            );
            atmosphere.forEach((node, pos) => {
                renderVelocity(
                    cellCtxRef.current!,
                    atmosphere.get(pos).velocity,
                    fieldSizePx
                );

                screenCtx.drawImage(
                    cellCanvasRef.current!,
                    pixelOffset + fieldSizePx * pos[0],
                    pixelOffset + fieldSizePx * pos[1],
                    fieldSizePx,
                    fieldSizePx
                );
                // drawCell(ctx, atmosphere, pos);
                // drawVelocity(ctx, node.velocity, pos, fieldSizePx);
            });
            // screenCtx.drawImage(
            //     cellCanvasRef.current!,
            //     0 + pixelOffset,
            //     0 + pixelOffset,
            //     fieldSizePx,
            //     fieldSizePx
            // );
        }

        const requestId = requestAnimationFrame(renderAtmosphere);

        return () => cancelAnimationFrame(requestId);
    });

    return (
        <canvas
            onClick={onClick}
            ref={displayCanvasRef}
            width={canvasSizePx}
            height={canvasSizePx}
        />
    );
}

function useCanvas(
    width: number,
    height: number,
    sourceCanvasRef?: RefObject<HTMLCanvasElement>
): [RefObject<HTMLCanvasElement>, RefObject<CanvasRenderingContext2D>] {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    useEffect(() => {
        const canvas = sourceCanvasRef
            ? sourceCanvasRef.current!
            : document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        canvasRef.current = canvas;
        ctxRef.current = ctx;
    }, []);

    return [canvasRef, ctxRef];
}
