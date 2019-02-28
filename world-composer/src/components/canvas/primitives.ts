// import {
//     Vector,
//     clamp,
//     normalize,
//     multiply,
//     magnitude,
//     Point,
//     add,
// } from '../../utils/Math';

// import { Color } from './utils/CanvasUtils';
// import { Atmosphere } from '../../data/Atmosphere';
// import { VelocityDrivenAtmo } from '../../data/VelocityDrivenAtmo';

// export function initializeGrid(
//     ctx: CanvasRenderingContext2D,
//     atmo: Atmosphere,
//     fieldSizePx: number
// ) {
//     ctx.beginPath();
//     ctx.strokeStyle = 'rgba(0,0,0,0.5)';
//     for (let i = 0; i < atmo.size; i++) {
//         for (let j = 0; j < atmo.size; j++) {
//             ctx.moveTo(i * fieldSizePx, (j + 1) * fieldSizePx - 1);
//             ctx.lineTo(i * fieldSizePx, j * fieldSizePx);
//             ctx.lineTo((i + 1) * fieldSizePx - 1, j * fieldSizePx);
//         }
//     }
//     ctx.stroke();
// }

// export function renderParticles(
//     ctx: CanvasRenderingContext2D,
//     cellCanvas: CanvasImageSource,
//     atmoDriver: VelocityDrivenAtmo,
//     fieldSizePx: number
// ) {
//     atmoDriver.particles.forEach(p => {
//         const offset = posToPx(p, fieldSizePx, atmoDriver.atmo);
//         ctx.drawImage(cellCanvas, offset[0] - 4, offset[1] - 4);
//     });
// }

// export function renderParticleTo(
//     ctx: CanvasRenderingContext2D,
//     atmoDriver: VelocityDrivenAtmo,
//     fieldSizePx: number
// ) {
//     ctx.strokeStyle = '#005b80';
//     ctx.fillStyle = '#0080b3';
//     const particleRadius = 4;
//     ctx.beginPath();
//     ctx.arc(0, 0, particleRadius, 0, 2 * Math.PI);
//     ctx.stroke();
//     ctx.fill();
//     ctx.closePath();
// }

// export function pxToAtmoPos(
//     x: number,
//     y: number,
//     fieldSizePx: number,
//     atmo: Atmosphere
// ): Point {
//     return [x / fieldSizePx - 0.5, y / fieldSizePx - 0.5];
// }

// export function posToPx(
//     p: Point,
//     fieldSizePx: number,
//     atmo: Atmosphere
// ): Point {
//     return [(p[0] + 0.5) * fieldSizePx, (p[1] + 0.5) * fieldSizePx];
// }
