import React, { useRef, useEffect } from 'react';
import { ImageDataContainer } from '../utils/ImageDataUtils';
import { useCanvas } from '../utils/CanvasUtils';

interface Props {
    id?: string;
    pixels: ImageDataContainer;
    width: number;
    height: number;
    smoothingEnabled: boolean;
}

// redraw given ImageData, scaling it to cover entire area provided by width/height
// parameters
export function ImageDataCanvas({
    id,
    pixels,
    width,
    height,
    smoothingEnabled,
}: Props) {
    const domCanvasRef = useRef<HTMLCanvasElement>(null);
    const [, displayCtx] = useCanvas(width, height, domCanvasRef);

    const [pixelCanvas, pixelCtx] = useCanvas(
        pixels.value.width,
        pixels.value.height
    );

    useEffect(
        () => {
            displayCtx.current!.imageSmoothingEnabled = smoothingEnabled;
        },
        [width, height, smoothingEnabled]
    );

    useEffect(
        () => {
            displayCtx.current!.clearRect(0, 0, width, height);
            pixelCtx.current!.putImageData(pixels.value, 0, 0);
            displayCtx.current!.drawImage(
                pixelCanvas.current!,
                0,
                0,
                width,
                height
            );
        },
        [pixels]
    );

    return <canvas id={id} width={width} height={height} ref={domCanvasRef} />;
}
