import React, { useRef, useEffect } from 'react';
import { useCanvas } from '../utils/CanvasUtils';

interface Props {
    id?: string;
    pixels: ImageData;
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
    const [pixelCanvas, pixelCtx] = useCanvas(pixels.width, pixels.height);

    useEffect(() => {
        if (pixelCanvas && displayCtx && pixelCtx) {
            displayCtx.imageSmoothingEnabled = smoothingEnabled;
            displayCtx.clearRect(0, 0, width, height);
            pixelCtx.putImageData(pixels, 0, 0);
            displayCtx.drawImage(pixelCanvas, 0, 0, width, height);
        }
    });

    return <canvas id={id} width={width} height={height} ref={domCanvasRef} />;
}
