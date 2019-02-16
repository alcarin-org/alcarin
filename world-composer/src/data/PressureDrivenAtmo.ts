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

export class PressureDrivenAtmo {
    public atmo: Atmosphere;

    // private neightboursMatrix: Int8Array;

    public constructor(atmo: Atmosphere) {
        this.atmo = atmo;
        this.precalcVelocityFromPressure();

        // this.neightboursMatrix = new Int8Array(atmo.dim2d ** 2).map(
        //     (_, ind) => this.getNeightboursCoords(this.atmo.coords(ind)).length
        // );
        // console.log('t', this.neightboursMatrix);
    }

    public evolve(deltaTime: number) {
        this.applyExternalPressure(deltaTime);
        this.precalcVelocityFromPressure();
        this.convectPressure(deltaTime);
    }

    private convectPressure(deltaTime: number) {
        this.atmo.forEach(node => (node.newPressure = node.pressure));

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

            const pressure = this.atmo.interpolatePressure(lastKnownP);
            const lastNode = this.atmo.get(lastKnownPCell);
            const pressureFlow = (deltaTime * (pressure + node.pressure)) / 2;
            // const pressureFlow = deltaTime * (pressure;
            lastNode.newPressure -= pressureFlow;
            node.newPressure += pressureFlow;
        });

        this.atmo.forEach(node => (node.pressure = node.newPressure!));
    }

    private precalcVelocityFromPressure() {
        // this step is just only for cache, as velocity results
        // from pressure directly

        this.atmo.forEach((node, p) => {
            // const [nNode, nPos, nRelPos] = this.getNeightboursCoords(p);
            // nNode.pressure;
            let yVel = 0;
            const upNode: Point = [p[0], p[1] - 1];
            const downNode: Point = [p[0], p[1] + 1];
            if (this.atmo.contains(upNode)) {
                yVel += this.pressure(upNode) - node.pressure;
            }
            if (this.atmo.contains(downNode)) {
                yVel -= this.pressure(downNode) - node.pressure;
            }

            let xVel = 0;
            const leftNode: Point = [p[0] - 1, p[1]];
            const rightNode: Point = [p[0] + 1, p[1]];
            if (this.atmo.contains(leftNode)) {
                xVel += this.pressure(leftNode) - node.pressure;
            }
            if (this.atmo.contains(rightNode)) {
                xVel -= this.pressure(rightNode) - node.pressure;
            }
            if (isNaN(xVel)) {
                console.log(this.pressure(leftNode), node.pressure);
            }
            // in place, for performance reasons
            node.velocity = [xVel, yVel];
        });
    }

    private pressure(p: Point) {
        return this.atmo.get(p).pressure;
    }

    private vel(p: Point) {
        return this.atmo.get(p).velocity;
    }

    private applyExternalPressure(deltaTime: number) {
        // todo
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
