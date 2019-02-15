import math from 'mathjs';

import { Vector, Point, normalize, perpendicular } from '../utils/Math';

export interface AtmosphereNode {
    // m/s^2
    velocity: Vector;
    pressure: number;
}

export interface Atmosphere {
    radius: number;
    data: AtmosphereNode[];
}

const Center: Point = [0, 0];

function coordsToArray(atmo: Atmosphere, pos: Point): number {
    const dim = 2 * atmo.radius - 1;
    return dim * (pos[1] + atmo.radius - 1) + (pos[0] + atmo.radius - 1);
}

function isInConstraints(atmo: Atmosphere, pos: Point): boolean {
    return (
        pos[0] > -atmo.radius &&
        pos[0] < atmo.radius &&
        pos[1] > -atmo.radius &&
        pos[1] < atmo.radius
    );
}

export function create(radius: number, data?: AtmosphereNode[]): Atmosphere {
    const dim = 2 * radius - 1;
    const nodes =
        data || new Array(dim ** 2).fill(null).map(defaultAtmosphereNode);
    return { radius, data: nodes };
}

export function get(atmo: Atmosphere, pos: Point): AtmosphereNode {
    if (!isInConstraints(atmo, pos)) {
        throw new Error(
            `Invalid atmosphere node position: ${pos[0]}, ${pos[1]}".`
        );
    }

    const arrCoords = coordsToArray(atmo, pos);
    return atmo.data[arrCoords];
}

export function set(
    atmo: Atmosphere,
    pos: Point,
    value: AtmosphereNode
): Atmosphere {
    if (!isInConstraints(atmo, pos)) {
        throw new Error(
            `Invalid atmosphere node position: ${pos[0]}, ${pos[1]}".`
        );
    }

    const arrCoords = coordsToArray(atmo, pos);

    const newAtmoData = atmo.data.slice(0);
    newAtmoData[arrCoords] = value;
    return create(atmo.radius, newAtmoData);
}

export function isInRadius(atmo: Atmosphere, pos: Point): boolean {
    return math.distance(pos, Center) <= atmo.radius - 1 + 0.5;
}

export function forEach(
    atmo: Atmosphere,
    callback: (node: AtmosphereNode, index: Point) => void
): void {
    const [cellsFrom, cellsTo] = [-atmo.radius + 1, atmo.radius - 1];
    for (let x = cellsFrom; x <= cellsTo; x++) {
        for (let y = cellsFrom; y <= cellsTo; y++) {
            const pos: Point = [x, y];
            callback(get(atmo, pos), pos);
        }
    }
}

export function randomizeField(atmo: Atmosphere): Atmosphere {
    return map(atmo, (node, pos) => {
        return {
            pressure: math.random(),
            velocity: isInRadius(atmo, pos)
                ? [1 - 2 * math.random(), 1 - 2 * math.random()]
                : [-0.02 * pos[0], -0.02 * pos[1]],
        };
    });
}

const defaultAtmosphereNode: () => AtmosphereNode = () => ({
    velocity: [0, 0],
    pressure: 0,
});

export function map(
    atmo: Atmosphere,
    callback: (
        node: AtmosphereNode,
        index: Point,
        originalAtmo: Atmosphere
    ) => AtmosphereNode
): Atmosphere {
    const [cellsFrom, cellsTo] = [-atmo.radius + 1, atmo.radius - 1];
    const newAtmo: Atmosphere = create(atmo.radius);
    for (let x = cellsFrom; x <= cellsTo; x++) {
        for (let y = cellsFrom; y <= cellsTo; y++) {
            const pos: Point = [x, y];
            const arrCoords = coordsToArray(atmo, pos);
            newAtmo.data[arrCoords] = callback(get(atmo, pos), pos, atmo);
        }
    }
    return newAtmo;
}

export function evolve(
    atmo: Atmosphere,
    centrifugalMagnitudeMod: number,
    coriolisMagnitudeMod: number
): Atmosphere {
    return map(atmo, (node, pos, originalAtmo) => {
        if (!isInRadius(atmo, pos)) {
            return node;
        }
        let velocity = node.velocity.slice() as Vector;
        const velocityPower = math.norm(velocity);
        const range = [-1, 0, 1];
        for (const i of range) {
            for (const j of range) {
                if (i === 0 && j === 0) {
                    continue;
                }
                const closeNodePos: Point = [pos[0] + i, pos[1] + j];
                if (!isInConstraints(atmo, closeNodePos)) {
                    continue;
                }
                // const proneRows = velocity[0] > 0 ? [0, 1] : [-1, 0];
                // const proneColumns = velocity[1] > 0 ? [0, 1] : [-1, 0];
                const arrCoords = coordsToArray(atmo, closeNodePos);
                const closeNode = originalAtmo.data[arrCoords];
                if (i !== 0 && math.sign(closeNode.velocity[0]) === i) {
                    continue;
                }
                if (j !== 0 && math.sign(closeNode.velocity[1]) === j) {
                    continue;
                }

                velocity[0] += closeNode.velocity[0];
                velocity[1] += closeNode.velocity[1];
            }
        }
        velocity = math.multiply(velocityPower, normalize(velocity)) as Vector;

        if (pos[0] !== 0 || pos[1] !== 0) {
            const distanceFromCenter = math.distance(pos, Center) as number;

            const centrifugalForce = math.multiply(
                centrifugalMagnitudeMod * distanceFromCenter,
                normalize(pos)
            ) as Vector;
            velocity[0] += centrifugalForce[0];
            velocity[1] += centrifugalForce[1];
            velocity = math.multiply(
                velocityPower,
                normalize(velocity)
            ) as Vector;

            const coriolisForce = math.multiply(
                distanceFromCenter * coriolisMagnitudeMod,
                perpendicular(normalize(pos))
            ) as Vector;
            velocity[0] += coriolisForce[0];
            velocity[1] += coriolisForce[1];

            velocity = math.multiply(
                velocityPower,
                normalize(velocity)
            ) as Vector;
        }

        return { ...node, velocity };
    });
}
