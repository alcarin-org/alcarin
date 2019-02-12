import {
    Vector,
    Point,
    magnitude,
    normalize,
    scale,
    perpendicular,
    sum,
    equals,
} from '../utils/Math';

export interface AtmosphereNode {
    // m/s^2
    velocity: Vector;
    pressure: number;
}

export interface Atmosphere {
    radius: number;
    data: AtmosphereNode[];
}

function coordsToArray(atmo: Atmosphere, pos: Point): number {
    const dim = 2 * atmo.radius - 1;
    return dim * (pos.y + atmo.radius - 1) + (pos.x + atmo.radius - 1);
}

function isInConstraints(atmo: Atmosphere, pos: Point): boolean {
    return (
        pos.x > -atmo.radius &&
        pos.x < atmo.radius &&
        pos.y > -atmo.radius &&
        pos.y < atmo.radius
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
            `Invalid atmosphere node position: ${pos.x}, ${pos.y}".`
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
            `Invalid atmosphere node position: ${pos.x}, ${pos.y}".`
        );
    }

    const arrCoords = coordsToArray(atmo, pos);

    const newAtmoData = atmo.data.slice(0);
    newAtmoData[arrCoords] = value;
    return create(atmo.radius, newAtmoData);
}

export function isInRadius(atmo: Atmosphere, pos: Point): boolean {
    return magnitude(pos) <= atmo.radius - 1 + 0.5;
}

export function forEach(
    atmo: Atmosphere,
    callback: (node: AtmosphereNode, index: Point) => void
): void {
    const [cellsFrom, cellsTo] = [-atmo.radius + 1, atmo.radius - 1];
    for (let x = cellsFrom; x <= cellsTo; x++) {
        for (let y = cellsFrom; y <= cellsTo; y++) {
            const pos = { x, y };
            callback(get(atmo, pos), pos);
        }
    }
}

export function randomizeField(atmo: Atmosphere): Atmosphere {
    return map(atmo, (node, pos) => {
        return {
            pressure: Math.random(),
            velocity: isInRadius(atmo, pos)
                ? {
                      x: 1 - 2 * Math.random(),
                      y: 1 - 2 * Math.random(),
                  }
                : {
                      x: -0.02 * pos.x,
                      y: -0.02 * pos.y,
                  },
        };
    });
}

const defaultAtmosphereNode: () => AtmosphereNode = () => ({
    velocity: { x: 0, y: 0 },
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
            const pos = { x, y };
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
        let velocity = { ...node.velocity };
        const velocityPower = magnitude(velocity);
        const range = [-1, 0, 1];
        for (const i of range) {
            for (const j of range) {
                if (i === 0 && j === 0) {
                    continue;
                }
                const closeNodePos = { x: pos.x + i, y: pos.y + j };
                if (!isInConstraints(atmo, closeNodePos)) {
                    continue;
                }
                // const proneRows = velocity.x > 0 ? [0, 1] : [-1, 0];
                // const proneColumns = velocity.y > 0 ? [0, 1] : [-1, 0];
                const arrCoords = coordsToArray(atmo, closeNodePos);
                const closeNode = originalAtmo.data[arrCoords];
                if (i !== 0 && Math.sign(closeNode.velocity.x) === i) {
                    continue;
                }
                if (j !== 0 && Math.sign(closeNode.velocity.y) === j) {
                    continue;
                }

                velocity.x += closeNode.velocity.x;
                velocity.y += closeNode.velocity.y;
            }
        }
        velocity = scale(velocityPower, normalize(velocity));

        if (pos.x !== 0 || pos.y !== 0) {
            const distanceFromCenter = magnitude(pos) / atmo.radius;

            const centrifugalForce = scale(
                centrifugalMagnitudeMod * distanceFromCenter,
                normalize(pos)
            );
            velocity.x += centrifugalForce.x;
            velocity.y += centrifugalForce.y;
            velocity = scale(velocityPower, normalize(velocity));

            const coriolisForce = scale(
                distanceFromCenter * coriolisMagnitudeMod,
                normalize(perpendicular(pos))
            );
            velocity.x += coriolisForce.x;
            velocity.y += coriolisForce.y;

            velocity = scale(velocityPower, normalize(velocity));
        }

        return { ...node, velocity };
    });
}
