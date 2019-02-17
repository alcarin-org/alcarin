import {
    Vector,
    constraints,
    normalize,
    multiply,
    magnitude,
    Point,
} from '../../utils/Math';
import { Atmosphere } from '../../data/Atmosphere';

const PressureDrawRange = 1.4;

export function renderVelocities(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere,
    screenOffsetX: number,
    screenOffsetY: number,
    fieldSizePx: number
) {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    atmo.forEach((node, pos) => {
        const offsetX =
            screenOffsetX + fieldSizePx * pos[0] + 0.5 * fieldSizePx;
        const offsetY =
            screenOffsetY + fieldSizePx * pos[1] + 0.5 * fieldSizePx;
        const vPower = constraints(0.1, 1, magnitude(node.velocity));
        const vNorm = normalize(node.velocity);
        const v = multiply(vNorm, 0.85 * fieldSizePx * vPower);

        ctx.moveTo(offsetX + -0.5 * v[0], offsetY + -0.5 * v[1]);
        ctx.lineTo(offsetX + 0.5 * v[0], offsetY + 0.5 * v[1]);

        ctx.fillRect(offsetX + 0.5 * v[0] - 1, offsetY + 0.5 * v[1] - 1, 2, 2);
    });
    ctx.stroke();
}

export function renderPressureTexture(
    ctx: CanvasRenderingContext2D,
    atmo: Atmosphere
) {
    atmo.forEach((node, pos) => drawCell(ctx, atmo, pos));
}

function drawCell(ctx: CanvasRenderingContext2D, atmo: Atmosphere, pos: Point) {
    const pressureColor = cellColor(atmo.get(pos).pressure);
    ctx.fillStyle = `rgb(${pressureColor[0]}, ${pressureColor[1]}, ${
        pressureColor[2]
    })`;
    ctx.fillRect(pos[0], pos[1], 1, 1);
}

function cellColor(pressure: number) {
    const factor = (pressure + PressureDrawRange) / (2 * PressureDrawRange);
    return [255 * factor, 0, 255 * (1 - factor), 1];
}
