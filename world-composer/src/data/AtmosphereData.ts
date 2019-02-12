import {
    Vector,
    Point,
    magnitude,
    normalize,
    scale,
    perpendicular,
} from '../utils/Math';

export interface AtmosphereNode {
    // m/s^2
    velocity: Vector;
}

export interface Atmosphere {
    radius: number;
    data: AtmosphereNode[][];
}

function coordsToArray(atmo: Atmosphere, pos: Point): Point {
    return {
        x: pos.x + atmo.radius - 1,
        y: pos.y + atmo.radius - 1,
    };
}

function isInConstraints(atmo: Atmosphere, pos: Point): boolean {
    return (
        pos.x > -atmo.radius &&
        pos.x < atmo.radius &&
        pos.y > -atmo.radius &&
        pos.y < atmo.radius
    );
}

export function create(radius: number, data?: AtmosphereNode[][]): Atmosphere {
    const nodes =
        data ||
        new Array(2 * radius - 1).fill(null).map(() => {
            const columnsArray = new Array(2 * radius - 1).fill(null);
            return columnsArray.map(defaultAtmosphereNode);
        });
    return { radius, data: nodes };
}

export function get(atmo: Atmosphere, pos: Point): AtmosphereNode {
    if (!isInConstraints(atmo, pos)) {
        throw new Error(
            `Invalid atmosphere node position: ${pos.x}, ${pos.y}".`
        );
    }

    const arrCoords = coordsToArray(atmo, pos);
    return atmo.data[arrCoords.x][arrCoords.y];
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

    const newAtmoRows = atmo.data.slice(0);
    const newAtmoColumn = newAtmoRows[arrCoords.x].slice(0);
    newAtmoColumn[arrCoords.y] = value;
    newAtmoRows[arrCoords.x] = newAtmoColumn;
    return create(atmo.radius, newAtmoRows);
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

export function randomizeVelocity(atmo: Atmosphere): Atmosphere {
    return map(atmo, (node, pos) => {
        return {
            velocity: isInRadius(atmo, pos)
                ? {
                      x: 1 - 2 * Math.random(),
                      y: 1 - 2 * Math.random(),
                  }
                : {
                      x: -pos.x,
                      y: -pos.y,
                  },
        };
    });
}

const defaultAtmosphereNode = () => ({
    velocity: { x: 0, y: 0 },
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
            newAtmo.data[arrCoords.x][arrCoords.y] = callback(
                get(atmo, pos),
                pos,
                atmo
            );
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
        for (let i = 1; i >= -1; i--) {
            for (let j = 1; j >= -1; j--) {
                const x = pos.x + i;
                const y = pos.y + j;
                if (i === 0 && j === 0) {
                    continue;
                }
                if (!isInConstraints(atmo, { x, y })) {
                    continue;
                }
                const arrCoords = coordsToArray(atmo, { x, y });
                const closeNode = originalAtmo.data[arrCoords.x][arrCoords.y];

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

        return { velocity };
    });
}
