import { Atmosphere, AtmosphereNode } from './Atmosphere';
import {
    Point,
    Vector,
    interpolate,
    multiply,
    add,
    round,
} from '../utils/Math';

enum VectorComponent {
    x = 0,
    y = 1,
}

export class VelocityDrivenAtmo {
    public atmo: Atmosphere;

    // private neightboursMatrix: Int8Array;

    public constructor(atmo: Atmosphere) {
        this.atmo = atmo;
        // this.precalcVelocityFromPressure();

        // this.neightboursMatrix = new Int8Array(atmo.dim2d ** 2).map(
        //     (_, ind) => this.getNeightboursCoords(this.atmo.coords(ind)).length
        // );
        // console.log('t', this.neightboursMatrix);
    }

    public evolve(deltaTime: number) {
        this.convectVelocity(deltaTime);
    }

    private convectVelocity(deltaTime: number) {
        // this.atmo.forEach(node => (node.newVelocity = node.velocity));
        console.log(deltaTime);
        this.atmo.forEach((node, p) => {
            // better velocity interpolation needed here
            const lastKnownP: Point = [
                p[0] - deltaTime * node.velocity[0],
                p[1] - deltaTime * node.velocity[1],
            ];
            const lastKnownPCell = round(lastKnownP);

            if (!this.atmo.contains(lastKnownPCell)) {
                return;
            }

            const avVelocity = this.atmo.interpolateVelocity(lastKnownP);
            node.newVelocity = avVelocity;
            // const newPoint =
        });

        this.atmo.forEach(node => (node.velocity = node.newVelocity));
    }

    private vel(p: Point) {
        return this.atmo.get(p).velocity;
    }

    // private getNeightboursCoords(p: Point): [AtmosphereNode, Point, Vector] {
    //     const neightbours = [];
    //     for (const offset of neightboursRange) {
    //         const nCoords: Point = [p[0] + offset[0], p[1] + offset[1]];
    //         if (this.atmo.contains(nCoords)) {
    //             neightbours.push([this.atmo.get(nCoords), nCoords, offset]);
    //         }
    //     }
    //     return neightbours;
    // }
}
