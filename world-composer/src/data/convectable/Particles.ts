import { Atmosphere } from '../Atmosphere';
import { Point, round } from '../../utils/Math';
import { ConvectValue } from './ConvectableValues';
import { Color } from '../../utils/Draw';

export interface Particles {
    // bundled Points as Float64Array.
    // code format: [x1, y1, x2, y2, x3, y3, ...]
    positions: Float64Array;
    colors: Uint8ClampedArray;
}

export const convectParticle: ConvectValue<Point, Particles> = (
    lastPos: Point
) => {
    // for particle it's new value is just it last position
    return lastPos;
};

const ParticleColors: Color[] = [
    [168, 100, 253, 255],
    [41, 205, 255, 255],
    [120, 255, 68, 255],
    [255, 113, 141, 255],
    [253, 255, 106, 255],
];

export function concatParticles(part1: Particles, part2: Particles): Particles {
    const concatedPositions = new Float64Array(
        part1.positions.length + part2.positions.length
    );
    concatedPositions.set(part1.positions, 0);
    concatedPositions.set(part2.positions, part1.positions.length);

    const concatedColors = new Uint8ClampedArray(
        part1.colors.length + part2.colors.length
    );
    concatedColors.set(part1.colors, 0);
    concatedColors.set(part2.colors, part1.colors.length);

    return {
        positions: concatedPositions,
        colors: concatedColors,
    };
}

export function createRandomParticles(
    count: number,
    atmo: Atmosphere,
    colors = ParticleColors
): Particles {
    const particles: Particles = {
        positions: new Float64Array(2 * count),
        colors: new Uint8ClampedArray(4 * count),
    };

    for (let i = 0; i < count; i++) {
        let p: Point | null = null;
        while (p === null || atmo.solidsVector[atmo.index(round(p))] === 1) {
            p = [
                1 + Math.random() * (atmo.size - 3),
                1 + Math.random() * (atmo.size - 3),
            ];
        }
        particles.positions.set(p, 2 * i);

        particles.colors.set(
            colors[Math.floor(Math.random() * colors.length)],
            4 * i
        );
    }
    return particles;
}
