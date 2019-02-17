import { Vector, Point, add, multiply } from '../utils/Math';

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

const RandomRange = 0.5;

export class Atmosphere {
    public readonly radius: number;
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

    public interpolateVelocity(p: Point) {
        const minCellP = [Math.floor(p[0]), Math.floor(p[1])];
        const relToCell = [p[0] - minCellP[0], p[1] - minCellP[1]];

        const range = [0, 1];
        let weightSum = 0;
        let resultVel: Vector = [0, 0];
        for (const offsetX of range) {
            for (const offsetY of range) {
                const neighPos: Point = [
                    minCellP[0] + offsetX,
                    minCellP[1] + offsetY,
                ];
                if (!this.contains(neighPos)) {
                    continue;
                }
                const neighVel = this.get(neighPos).velocity;
                const velWeight =
                    (offsetX === 0 ? 1 - relToCell[0] : relToCell[0]) *
                    (offsetY === 0 ? 1 - relToCell[1] : relToCell[1]);
                weightSum += velWeight;
                resultVel = add(resultVel, multiply(neighVel, velWeight));
            }
        }

        return weightSum === 0 ? Vector0 : multiply(resultVel, 1 / weightSum);
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
        return this.apply((node, p) => {
            return {
                ...node,
                pressure: 0,
                velocity: [
                    (p[0] < 0 ? 1 : 0) +
                        // Math.sin(p[0]) * RandomPressureRange +
                        // Math.cos(p[1]) * RandomPressureRange +
                        RandomRange / 2 -
                        RandomRange * Math.random(),
                    RandomRange / 2 - RandomRange * Math.random(),
                ],
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
        const realRadius = this.radius - 0.5;
        return (
            p[0] > -realRadius &&
            p[0] < realRadius &&
            p[1] > -realRadius &&
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
