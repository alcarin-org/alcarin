import React, {
    useRef,
    useEffect,
    useState,
    MouseEventHandler,
    RefObject,
} from 'react';

import {
    renderBgTexture,
    renderBigBgTexture,
    renderVelocities,
    MapType,
    initializeGrid,
    pxToAtmoPos,
} from './primitives';
import { Atmosphere, AtmosphereNode, NodeType } from '../../data/Atmosphere';
import {
    Point,
    Vector,
    constraints,
    normalize,
    multiply,
    floor,
    add,
} from '../../utils/Math';

interface Props {
    atmosphere: Atmosphere;
    fieldSizePx?: number;
    onClick: (p: Point) => void;
    mapType: MapType;
    selectedNodePosition?: Point;
    drawRealInterpolation: boolean;
    drawGrid: boolean;
}

export default function WeatherCanvas({
    atmosphere,
    fieldSizePx = 40,
    onClick,
    mapType = MapType.Pressure,
    drawRealInterpolation,
    drawGrid,
    selectedNodePosition,
}: Props) {
    const atmo = atmosphere;
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const canvasSizePx = fieldSizePx * atmo.dim2d;

    const [screenCanvasRef, screenCtxRef] = useCanvas(
        canvasSizePx,
        canvasSizePx,
        displayCanvasRef
    );
    const [gridCanvasRef, gridCtxRef] = useCanvas(canvasSizePx, canvasSizePx);
    const [bgCanvasRef, bgCtxRef] = useCanvas(atmo.dim2d, atmo.dim2d);

    const [cellCanvasRef, cellCtxRef] = useCanvas(fieldSizePx, fieldSizePx);
    const pixelOffset = (atmo.radius - 1) * fieldSizePx;

    useEffect(() => {
        screenCtxRef.current!.strokeStyle = 'black';
        bgCtxRef.current!.translate(atmo.radius - 1, atmo.radius - 1);
        const halfSize = Math.trunc(fieldSizePx / 2);
        cellCtxRef.current!.translate(halfSize, halfSize);
        cellCtxRef.current!.strokeStyle = 'black';
        initializeGrid(gridCtxRef.current!, atmo, fieldSizePx);
    }, []);

    useEffect(() => {
        function renderAtmosphere() {
            const screenCtx = screenCtxRef.current!;
            screenCtx.strokeStyle = 'black';
            screenCtx.setLineDash([]);

            if (drawRealInterpolation) {
                renderBigBgTexture(
                    screenCtx,
                    pixelOffset,
                    canvasSizePx,
                    fieldSizePx,
                    atmo,
                    mapType
                );
            } else {
                renderBgTexture(bgCtxRef.current!, atmo, mapType);
                screenCtx.drawImage(
                    bgCanvasRef.current!,
                    0,
                    0,
                    canvasSizePx,
                    canvasSizePx
                );
            }

            if (drawGrid) {
                screenCtx.drawImage(gridCanvasRef.current!, 0, 0);
            }

            renderVelocities(
                screenCtx,
                atmo,
                pixelOffset,
                pixelOffset,
                fieldSizePx
            );

            if (selectedNodePosition) {
                const pos = floor(selectedNodePosition);

                screenCtx.strokeStyle = 'rgba(255,0,0,0.75)';
                screenCtx.setLineDash([5, 5]);
                // screenCtx.stroke
                screenCtx.strokeRect(
                    pixelOffset + pos[0] * fieldSizePx,
                    pixelOffset + pos[1] * fieldSizePx,
                    fieldSizePx,
                    fieldSizePx
                );
            }
        }

        const requestId = requestAnimationFrame(renderAtmosphere);

        return () => cancelAnimationFrame(requestId);
    });

    function onAtmoClick(ev: React.MouseEvent) {
        const pos = pxToAtmoPos(
            ev.nativeEvent.offsetX,
            ev.nativeEvent.offsetY,
            fieldSizePx,
            atmo
        );
        onClick(pos);
    }

    return (
        <canvas
            onClick={onAtmoClick}
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
