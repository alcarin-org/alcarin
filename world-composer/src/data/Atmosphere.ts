import math from 'mathjs';

import { Vector, Point } from '../utils/Math';

export enum NodeType {
    Fluid,
    Solid,
}

export interface AtmosphereNode {
    // m/s^2
    velocity: Vector;
    pressure: number;
    type: NodeType;
    fluidIndex: number;
}

export const Center: Point = [0, 0];
export const SolidNode: AtmosphereNode = Object.freeze<AtmosphereNode>({
    velocity: [0, 0],
    pressure: 0,
    type: NodeType.Solid,
    fluidIndex: -1,
});

export class Atmosphere {
    public readonly radius: number;
    public readonly fluidCoords: Point[];
    private nodes: AtmosphereNode[];

    public constructor(radius: number) {
        this.radius = radius;
        const dim = this.dim2d;

        this.fluidCoords = [];
        this.nodes = new Array(dim ** 2).fill(null).map((_, ind) => {
            const coords = this.coords(ind);
            const inRadius = this.isInRadius(coords);
            if (inRadius) {
                this.fluidCoords.push(coords);
            }
            return inRadius
                ? {
                      velocity: [0, 0] as Vector,
                      pressure: 0,
                      type: NodeType.Fluid,
                      fluidIndex: this.fluidCoords.length - 1,
                  }
                : SolidNode;
        });
        this.fluidCoords = Object.freeze<Point[]>(this.fluidCoords);
    }

    public forEach(callback: (node: AtmosphereNode, pos: Point) => void) {
        this.fluidCoords.forEach((pos: Point) => callback(this.get(pos), pos));
    }

    public get(pos: Point): AtmosphereNode {
        const ind = this.index(pos);
        if (ind < 0 || ind >= this.nodes.length) {
            return SolidNode;
        }
        return this.nodes[ind];
    }

    public set(pos: Point, value: AtmosphereNode) {
        this.nodes[this.index(pos)] = value;
    }

    public apply(
        callback: (
            node: AtmosphereNode,
            pos: Point,
            originalAtmo: Atmosphere
        ) => AtmosphereNode
    ) {
        const newNodes = new Array(this.nodes.length).fill(SolidNode);
        this.forEach((node, pos) => {
            const index = this.index(pos);
            newNodes[index] = callback(this.nodes[index], pos, this);
        });

        this.nodes = newNodes;
    }

    public randomizeField() {
        return this.apply((node, pos) => {
            return {
                ...node,
                pressure: 0,
                velocity: [1 * math.random(), 1 * math.random()],
                // velocity: [0.5 - 1 * math.random(), 0.5 - 1 * math.random()],
            };
        });
    }

    public get fluidFieldsCount() {
        return this.fluidCoords.length;
    }

    private get dim2d() {
        return 2 * this.radius - 1;
    }

    private index(pos: Point) {
        const dim = 2 * this.radius - 1;
        return dim * (pos[1] + this.radius - 1) + (pos[0] + this.radius - 1);
    }

    private coords(index: number): Point {
        return [
            (index % this.dim2d) - this.radius + 1,
            Math.floor(index / this.dim2d) - this.radius + 1,
        ];
    }

    private isInRadius(pos: Point): boolean {
        return math.distance(pos, Center) <= this.radius - 1 + 0.5;
    }
}
