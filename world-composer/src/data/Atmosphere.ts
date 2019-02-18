import {
    Vector,
    Point,
    add,
    multiply,
    VectorComponent,
    normalize,
} from '../utils/Math';

export enum NodeType {
    Fluid,
    Solid,
}

export interface AtmosphereNode {
    // m/s^2
    velocity: Vector;
    newVelocity: Vector;
    pressure: number;
    type: NodeType;
}

const Center: Point = [0, 0];
const Vector0: Vector = [0, 0];

const RandomRange = 0.8;

export class Atmosphere {
    public readonly radius: number;
    // coded as MAC grid with cell size 1.
    // integer point ((px, py)) represent left-top corner of a cell
    // pressure is stored on the center of cell ((px, py) + (0.5, 0.5))
    // velocity X is on the middle of the left face (px, py + 0.5)
    // velocity Y is on the middle of the top face (px + 0.5, py)
    private nodes: AtmosphereNode[];

    public constructor(radius: number) {
        this.radius = radius;
        const dim = this.dim2d;

        this.nodes = new Array(dim ** 2).fill(null).map((_, ind) => {
            const coords = this.coords(ind);

            return {
                velocity: Vector0,
                newVelocity: Vector0,
                pressure: 0,
                type: NodeType.Fluid,
            };
        });
    }

    get size() {
        return this.nodes.length;
    }

    public divergence(pos: Point): number {
        const cellVel = this.get(pos).velocity;
        const nextXPos: Point = [pos[0] + 1, pos[1]];
        const nextYPos: Point = [pos[0], pos[1] + 1];

        const xDiff = this.contains(nextXPos)
            ? this.get(nextXPos).velocity[0] - cellVel[0]
            : 0;
        const yDiff = this.contains(nextYPos)
            ? this.get(nextYPos).velocity[1] - cellVel[1]
            : 0;

        return xDiff + yDiff;
    }

    public interpolateVelocity(p: Point): Vector {
        return [
            this.interpolateVelocityAt([p[0], p[1] - 0.5], VectorComponent.x),
            this.interpolateVelocityAt([p[0] - 0.5, p[1]], VectorComponent.y),
        ];
    }

    public interpolateVelocityAt(p: Point, cmp: VectorComponent): number {
        const minCellP = [Math.floor(p[0]), Math.floor(p[1])];
        const relToCell = [p[0] - minCellP[0], p[1] - minCellP[1]];

        const range = [0, 1];
        let weightSum = 0;
        let resultVel = 0;
        for (const offsetX of range) {
            for (const offsetY of range) {
                const neighPos: Point = [
                    minCellP[0] + offsetX,
                    minCellP[1] + offsetY,
                ];
                if (!this.contains(neighPos)) {
                    continue;
                }
                const neighVel = this.get(neighPos).velocity[cmp];
                const velWeight =
                    (offsetX === 0 ? 1 - relToCell[0] : relToCell[0]) *
                    (offsetY === 0 ? 1 - relToCell[1] : relToCell[1]);
                weightSum += velWeight;
                resultVel += neighVel * velWeight;
            }
        }

        return weightSum === 0 ? 0 : resultVel / weightSum;
    }

    public interpolatePressure(p: Point) {
        const minCellP = [Math.floor(p[0]), Math.floor(p[1])];
        const relToCell = [p[0] - minCellP[0], p[1] - minCellP[1]];

        const range = [0, 1];
        let weightSum = 0;
        let resultPressure = 0;
        for (const offsetX of range) {
            for (const offsetY of range) {
                const neighPos: Point = [
                    minCellP[0] + offsetX,
                    minCellP[1] + offsetY,
                ];
                if (!this.contains(neighPos)) {
                    continue;
                }
                const neighPressure = this.get(neighPos).pressure;
                const velWeight =
                    (offsetX === 0 ? 1 - relToCell[0] : relToCell[0]) *
                    (offsetY === 0 ? 1 - relToCell[1] : relToCell[1]);
                weightSum += velWeight;
                resultPressure = resultPressure + neighPressure * velWeight;
            }
        }

        return weightSum === 0 ? 0 : resultPressure / weightSum;
    }

    // public injectNewPressure(p: Point, pressure: number) {
    //     const minCellP = [Math.floor(p[0]), Math.floor(p[1])];
    //     const relToCell = [p[0] - minCellP[0], p[1] - minCellP[1]];

    //     const range = [0, 1];
    //     let weightSum = 0;
    //     // let resultPressure = 0;

    //     // (p * weight) / (weightSum)
    //     const nodes: AtmosphereNode[] = new Array(4);
    //     const pressureToApply: Float64Array = new Float64Array(4);
    //     for (const offsetX of range) {
    //         for (const offsetY of range) {
    //             const neighPos: Point = [
    //                 minCellP[0] + offsetX,
    //                 minCellP[1] + offsetY,
    //             ];
    //             if (!this.contains(neighPos)) {
    //                 continue;
    //             }
    //             const ind = offsetY * 2 + offsetX;
    //             // const neighPressure = this.get(neighPos).pressure;
    //             nodes[ind] = this.get(neighPos);

    //             const velWeight =
    //                 (offsetX === 0 ? 1 - relToCell[0] : relToCell[0]) *
    //                 (offsetY === 0 ? 1 - relToCell[1] : relToCell[1]);
    //             weightSum += velWeight;

    //             pressureToApply[ind] = pressure * velWeight;
    //         }
    //     }

    //     let injectSum = 0;
    //     for (let i = 0; i < 4; i++) {
    //         if (nodes[i]) {
    //             injectSum += pressureToApply[i] / weightSum;
    //             nodes[i].newPressure += pressureToApply[i] / weightSum;
    //         }
    //     }
    // }

    public randomizeField() {
        const rand = () => RandomRange / 2 - RandomRange * Math.random();
        type RandomMethod = (p: Point) => Vector;
        const methods: RandomMethod[] = [
            // random
            () => [
                1.5 * RandomRange - 3 * RandomRange * Math.random(),
                1.5 * RandomRange - 3 * RandomRange * Math.random(),
            ],
            // left -> right
            p => [
                (p[0] < 0 ? 2 : 0) +
                    RandomRange / 2 -
                    RandomRange * Math.random(),
                RandomRange / 2 - RandomRange * Math.random(),
            ],
            // // many circles
            p => [
                Math.cos((2 * Math.PI * p[0]) / this.radius) + rand(),
                Math.sin((2 * Math.PI * p[1]) / this.radius) + rand(),
            ],
            // // curl
            p => multiply([p[1] - 0.1, -p[0] - 0.1], 0.15),
        ];
        const randMethod = methods[Math.floor(Math.random() * methods.length)];
        return this.apply((node, p) => {
            return {
                ...node,
                pressure: 0,
                velocity: randMethod(p),
            };
        });
    }

    public get(p: Point): AtmosphereNode {
        // this check should be removed on working alghoritm, for performance
        if (!this.contains(p)) {
            throw new Error(`Point (${p[0]}, ${p[1]}) is not in map radius`);
        }
        return this.nodes[this.index(p)];
    }

    public set(p: Point, value: AtmosphereNode) {
        // this check should be removed on working alghoritm, for performance
        if (!this.contains(p)) {
            throw new Error(`Point (${p[0]}, ${p[1]}) is not in map radius`);
        }
        this.nodes[this.index(p)] = value;
    }

    public forEach(callback: (node: AtmosphereNode, p: Point) => void) {
        this.nodes.forEach((node, index) => {
            callback(node, this.coords(index));
        });
    }

    public apply(
        callback: (
            node: AtmosphereNode,
            p: Point,
            originalAtmo: Atmosphere
        ) => AtmosphereNode
    ) {
        const newNodes = new Array(this.nodes.length);
        this.nodes.map((node, index) => {
            const coords = this.coords(index);
            newNodes[index] = callback(node, coords, this);
        });

        this.nodes = newNodes;
    }

    public get dim2d() {
        return 2 * this.radius - 1;
    }

    public contains(p: Point): boolean {
        const realRadius = this.radius;
        return (
            p[0] >= -realRadius + 1 &&
            p[0] < realRadius &&
            p[1] >= -realRadius + 1 &&
            p[1] < realRadius
        );
    }

    // public isInRadius(p: Point): boolean {
    //     return math.distance(p, Center) <= this.radius - 1 + 0.5;
    // }

    public index(p: Point) {
        const dim = 2 * this.radius - 1;
        return dim * (p[1] + this.radius - 1) + (p[0] + this.radius - 1);
    }

    public coords(index: number): Point {
        return [
            (index % this.dim2d) - this.radius + 1,
            Math.floor(index / this.dim2d) - this.radius + 1,
        ];
    }
}
