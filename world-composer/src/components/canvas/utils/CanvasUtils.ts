import { useEffect, useState, RefObject } from 'react';

export function useCanvas(
    width: number,
    height: number,
    sourceCanvasRef?: RefObject<HTMLCanvasElement>
): [
    HTMLCanvasElement | null,
    CanvasRenderingContext2D | null,
    (ctx: CanvasRenderingContext2D) => void
] {
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    const sourceCanvasWidth =
        sourceCanvasRef &&
        sourceCanvasRef.current &&
        sourceCanvasRef.current.width;
    const sourceCanvasHeight =
        sourceCanvasRef &&
        sourceCanvasRef.current &&
        sourceCanvasRef.current.height;
    useEffect(
        () => {
            const canvas = sourceCanvasRef
                ? sourceCanvasRef.current!
                : document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d')!;
            setCanvas(canvas);
            setCtx(ctx);
        },
        [sourceCanvasRef, sourceCanvasWidth, sourceCanvasHeight]
    );

    return [canvas, ctx, setCtx];
}

export function createImageData(width: number, height: number): ImageData {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context2d = canvas.getContext('2d');
    return context2d!.getImageData(0, 0, width, height);
}
