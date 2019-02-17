import math from 'mathjs';

import { Vector, Point, add, multiply } from '../utils/Math';

export enum NodeType {
    Fluid,
    Solid,
}

export interface AtmosphereNode {
    // m/s^2
    velocity: Vector;
    pressure: number;
    newPressure: number;
    type: NodeType;
}

const Center: Point = [0, 0];
const Vector0: Vector = [0, 0];

const DefaultPressure = 0;
const RandomPressureRange = 0.3;

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
                pressure: DefaultPressure,
                type: NodeType.Fluid,
                newPressure: 0,
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

        return weightSum === 0 ? 0 : multiply(resultVel, 1 / weightSum);
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

    public randomizeField() {
        return this.apply((node, p) => {
            return {
                ...node,
                pressure:
                    Math.sin(p[0]) * RandomPressureRange +
                    // Math.cos(p[1]) * RandomPressureRange +
                    0.25 -
                    0.5 * Math.random(),
                velocity: [0, 0],
            };
        });
    }

    public get(p: Point): AtmosphereNode {
        const ind = this.index(p);
        if (ind < 0 || ind >= this.nodes.length) {
            throw new Error(`Point (${p[0]}, ${p[1]}) is not in map radius`);
        }
        return this.nodes[ind];
    }

    public set(p: Point, value: AtmosphereNode) {
        const ind = this.index(p);
        if (ind < 0 || ind >= this.nodes.length) {
            throw new Error(`Point (${p[0]}, ${p[1]}) is not in map radius`);
        }
        this.nodes[ind] = value;
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
        const ind = this.index(p);
        return ind >= 0 && ind < this.nodes.length;
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
