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
// import { VelocityDrivenAtmo } from '../../data/engine/AtmosphereEngine';

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
