import * as MACGrid from '../atmosphere/MACGrid';
import * as AtmosphereEngine from '../engine/AtmosphereEngine';
import { Point, round } from '../../utils/Math';
import { Color, colorToNumber } from '../../utils/Draw';

// particles are often removed and added.
// we create bigger particles buffer every time we need
// add some particles, so we can minimize recreation of entire
// structure
const ParticlesBufferSize = 1500;

export interface ParticlesData {
    count: number;
    // bundled Points as Float32Array.
    // code format: [x1, y1, x2, y2, x3, y3, ...]
    positions: Float32Array;
    // colors encoded at float64 numbers (every 8-bit from 32-bits represent in order r,g,b,a values)
    colors: Uint32Array;
}

const ParticleColors: Color[] = [
    [168, 100, 253, 255],
    [41, 205, 255, 255],
    [120, 255, 68, 255],
    [255, 113, 141, 255],
    [253, 255, 106, 255],
];

export interface HashTable {
    [key: string]: null;
}

function sampleColor(): Color {
    return ParticleColors[Math.floor(Math.random() * ParticleColors.length)];
}

// prepare new Particles structure if the new count of particles are bigger than
// provided particles buffer. if not, just return provided "particles" with updated
// count
function prepareParticlesBuffer(
    particles: ParticlesData,
    count: number
): ParticlesData {
    const currentBufferSize = particles.colors.length;
    if (currentBufferSize > count) {
        return {
            ...particles,
            count,
        };
    }
    const newPositions = new Float32Array(2 * (count + ParticlesBufferSize));
    newPositions.set(particles.positions, 0);

    const newColors = new Uint32Array(count + ParticlesBufferSize);
    newColors.set(particles.colors, 0);

    return {
        count,
        positions: newPositions,
        colors: newColors,
    };
}

export function create(): ParticlesData {
    return {
        count: 0,
        positions: new Float32Array(2 * ParticlesBufferSize),
        colors: new Uint32Array(ParticlesBufferSize),
    };
}

function firstKey(obj: {}): string {
    // tslint:disable forin
    for (const key in obj) {
        return key;
    }

    return '-1';
}

export function removeParticlesOnIndexes(
    particles: ParticlesData,
    indexesHash: HashTable
): ParticlesData {
    let particlesToRemove = Object.keys(indexesHash).length;
    const newCount = particles.count - particlesToRemove;

    for (let ind = particles.count - 1; ind >= 0; ind--) {
        if (particlesToRemove === 0) {
            break;
        }
        // if we got particles to remove on particles tail, we just ignore
        // it, it will be automatically removed by decreasing buffer "count"
        if (ind in indexesHash) {
            delete indexesHash[ind];
            particlesToRemove--;
            continue;
        }
        // if we got proper particle on the end, we use it to plug some other
        // particle that should be removed
        const indToRemove = parseInt(firstKey(indexesHash), 10);
        particles.colors[indToRemove] = particles.colors[ind];
        particles.positions[2 * indToRemove] = particles.positions[2 * ind];
        particles.positions[2 * indToRemove + 1] =
            particles.positions[2 * ind + 1];
        delete indexesHash[indToRemove];
        particlesToRemove--;
    }

    return {
        ...particles,
        count: newCount,
    };
}

/**
 * contact part1 particles with part2.
 * if part1 particles buffer is enough in size, it will be reused,
 * so should be used carefuly
 */
export function concatParticles(
    part1: ParticlesData,
    part2: ParticlesData
): ParticlesData {
    const originalCount = part1.count;
    const newCount = part1.count + part2.count;
    const resultParticles = prepareParticlesBuffer(part1, newCount);

    resultParticles.positions.set(part2.positions, 2 * originalCount);
    resultParticles.colors.set(part2.colors, originalCount);

    return resultParticles;
}

export function createRandomParticles(
    count: number,
    grid: MACGrid.MACGridData,
    color?: Color
): ParticlesData {
    const colorAsNumbers = colorToNumber(color || sampleColor());
    const particles: ParticlesData = {
        count,
        positions: new Float32Array(2 * count),
        colors: new Uint32Array(count),
    };

    for (let i = 0; i < count; i++) {
        let p: Point | null = null;
        let containInd: number | null = null;
        do {
            p = [
                0.5 + Math.random() * (grid.size - 2),
                0.5 + Math.random() * (grid.size - 2),
            ];
            containInd = MACGrid.index(grid, round(p));
        } while (p === null || grid.solids[containInd] === 1);

        particles.positions.set(p, 2 * i);

        particles.colors[i] = colorAsNumbers;
    }
    return particles;
}

export function fillWithRandomParticles(
    particles: ParticlesData,
    count: number,
    grid: MACGrid.MACGridData
): ParticlesData {
    return concatParticles(particles, createRandomParticles(count, grid));
}

export function update(
    particles: ParticlesData,
    grid: MACGrid.MACGridData,
    deltaTime: DOMHighResTimeStamp
): ParticlesData {
    const positions = particles.positions;
    for (let i = 0; i < particles.count; i++) {
        const i2 = i * 2;

        const newPos = AtmosphereEngine.convectValue(
            grid,
            deltaTime,
            [positions[i2], positions[i2 + 1]],
            convectParticle
        );
        positions.set(newPos, i2);
    }
    return { ...particles };
}

function convectParticle(lastPos: Point) {
    // for particle it's new value is just it last position
    return lastPos;
}
