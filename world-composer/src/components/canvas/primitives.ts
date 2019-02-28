import {
    Vector,
    clamp,
    normalize,
    multiply,
    magnitude,
    Point,
    add,
} from '../../utils/Math';

import {Color} from './utils/DrawUtils';
import { Atmosphere } from '../../data/Atmosphere';
import { VelocityDrivenAtmo } from '../../data/VelocityDrivenAtmo';

export enum MapType {
    Pressure,
    Velocity,
    Divergence,
    Neutral,
}

const SolidColor: Color = [100, 100, 100];
const NeutralColor: Color = [50, 50, 50];

const PressureDrawRange = 0.5;
const VelocityDrawRange = 2.5;
const DivergenceDrawRange = 0.1;

export function initializeGrid(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere,
    fieldSizePx: number
) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)';
    for (let i = 0; i < atmo.size; i++) {
        for (let j = 0; j < atmo.size; j++) {
            ctx.moveTo(i * fieldSizePx, (j + 1) * fieldSizePx - 1);
            ctx.lineTo(i * fieldSizePx, j * fieldSizePx);
            ctx.lineTo((i + 1) * fieldSizePx - 1, j * fieldSizePx);
        }
    }
    ctx.stroke();
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

    ctx.beginPath();
    ctx.fillStyle = 'yellow';
    ctx.strokeStyle = 'black';
    // atmo.velX.forEach((vel, ind) => {
    //     const offset = posToPx(atmo.coords(ind), fieldSizePx, atmo);
    //     const v = clamp(-1, 1, vel) * fieldSizePx * 0.4;

    //     drawVectorFromTo(
    //         [offset[0] - 0.5 * fieldSizePx, offset[1]],
    //         [offset[0] - 0.5 * fieldSizePx + v, offset[1]]
    //     );
    // });
    // atmo.velY.forEach((vel, ind) => {
    //     const offset = posToPx(atmo.coords(ind), fieldSizePx, atmo);
    //     const v = clamp(-1, 1, vel) * fieldSizePx * 0.4;

    //     drawVectorFromTo(
    //         [offset[0], offset[1] - 0.5 * fieldSizePx],
    //         [offset[0], offset[1] - 0.5 * fieldSizePx + v]
    //     );
    // });
    for (let i = 0; i < atmo.size; i++) {
        for (let j = 0; j < atmo.size; j++) {
            const ind = atmo.index([i, j]);
            if (atmo.solidsVector[ind] === 1) {
                continue;
            }
            const vel = atmo.interpolateVelocity([i, j]);
            const offset = posToPx([i, j], fieldSizePx, atmo);
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
export function renderParticles(
    ctx: CanvasRenderingContext2D,
    cellCanvas: CanvasImageSource,
    atmoDriver: VelocityDrivenAtmo,
    fieldSizePx: number
) {
    atmoDriver.particles.forEach(p => {
        const offset = posToPx(p, fieldSizePx, atmoDriver.atmo);
        ctx.drawImage(cellCanvas, offset[0] - 4, offset[1] - 4);
    });
}

export function renderParticleTo(
    ctx: CanvasRenderingContext2D,
    atmoDriver: VelocityDrivenAtmo,
    fieldSizePx: number
) {
    ctx.strokeStyle = '#005b80';
    ctx.fillStyle = '#0080b3';
    const particleRadius = 4;
    ctx.beginPath();
    ctx.arc(0, 0, particleRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
}

function bgColorFromPoint(
    atmo: Atmosphere,
    mapType: MapType,
    pos: Point,
    divVector: Float64Array | null
) {
    const ind = atmo.index(pos);
    switch (mapType) {
        case MapType.Velocity:
            if (atmo.solidsVector[ind] === 1) {
                return SolidColor;
            }
            return velocityColor(atmo.interpolateVelocity(pos));
            break;
        case MapType.Divergence:
            return divergenceColor(divVector![atmo.index(pos)]);
            break;
        case MapType.Pressure:
            return pressureColor(atmo.pressureVector[ind]);
        case MapType.Neutral:
        default:
            return atmo.solidsVector[ind] === 1 ? SolidColor : NeutralColor;
    }
}

export function renderBgTexture(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere,
    mapType: MapType
) {
    const divVector =
        mapType === MapType.Divergence ? atmo.divergenceVector() : null;
    for (let i = 0; i < atmo.size; i++) {
        for (let j = 0; j < atmo.size; j++) {
            const pos: Point = [i, j];
            const color = bgColorFromPoint(atmo, mapType, pos, divVector);
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(pos[0], pos[1], 1, 1);
        }
    }
}

export function renderBigBgTexture(
    ctx: CanvasRenderingContext2D,
    canvasSizePx: number,
    fieldSizePx: number,
    atmo: Atmosphere,
    mapType: MapType
) {
    for (let i = 0; i < canvasSizePx; i++) {
        for (let j = 0; j < canvasSizePx; j++) {
            const p = pxToAtmoPos(i, j, fieldSizePx, atmo);
            let color: Color;
            switch (mapType) {
                case MapType.Velocity:
                    color = velocityColor(
                        atmo.interpolateVelocity(add(p, [0, -0.5]))
                    );
                    break;
                case MapType.Pressure:
                default:
                    color = pressureColor(atmo.interpolatePressure(p));
            }
            ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
            ctx.fillRect(i, j, 1, 1);
        }
    }
}

function pressureColor(pressure: number): Color {
    const factor = (pressure + PressureDrawRange) / (2 * PressureDrawRange);
    return [255 * factor, 0, 255 * (1 - factor)];
}

function velocityColor(velocity: Vector): Color {
    const length = magnitude(velocity);
    const factor = (length + VelocityDrawRange) / (2 * VelocityDrawRange);
    return [255 * factor, 0, 255 * (1 - factor)];
}

function divergenceColor(divergence: number): Color {
    const factor =
        (divergence + DivergenceDrawRange) / (2 * DivergenceDrawRange);
    return [255 * factor, 0, 255 * (1 - factor)];
}

export function pxToAtmoPos(
    x: number,
    y: number,
    fieldSizePx: number,
    atmo: Atmosphere
): Point {
    return [x / fieldSizePx - 0.5, y / fieldSizePx - 0.5];
}

export function posToPx(
    p: Point,
    fieldSizePx: number,
    atmo: Atmosphere
): Point {
    return [(p[0] + 0.5) * fieldSizePx, (p[1] + 0.5) * fieldSizePx];
}
