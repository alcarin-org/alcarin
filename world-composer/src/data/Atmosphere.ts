import {
    Vector,
    Point,
    add,
    multiply,
    VectorComponent,
    normalize,
} from '../utils/Math';

const Center: Point = [0, 0];
const Vector0: Vector = [0, 0];

const RandomRange = 0.1;
const DefaultRange = 5;

// function assert(condition, message) {
//     if (!condition) {
//         throw message || "Assertion failed";
//     }
// }
export class Atmosphere {
    // coded as MAC grid with cell size 1.
    // integer point ((px, py)) represent center of a cell
    // pressure is stored on the center of cell (px, py)
    // velocity X is on the middle of the left face (px - 0.5, py)
    // velocity Y is on the middle of the top face (px, py - 0.5),
    // e.g. velX: (-0.5, 0), velY: (0, -0.5)
    // the map is surronded by 1 cell solids buffer

    public readonly radius: number;
    public readonly solidsVector: Int8Array;
    public pressureVector: Float64Array;
    // X velocities component, stored on (x-0.5, y) from center of every cell
    public velX: Float64Array;
    // Y velocities component, stored on (x, y-0.5) from center of every cell
    public velY: Float64Array;

    public readonly size: number;
    public readonly vectorSize: number;

    public constructor(radius: number) {
        this.radius = radius;

        // we create additionall buffer of solids around our map
        this.size = 2 * (this.radius + 1) - 1;
        this.vectorSize = this.size ** 2;

        this.pressureVector = new Float64Array(this.vectorSize);
        this.velX = new Float64Array(this.vectorSize);
        this.velY = new Float64Array(this.vectorSize);
        this.solidsVector = new Int8Array(this.vectorSize).map((_, ind) =>
            Math.floor(ind / this.size) === 0 ||
            Math.floor(ind / this.size) === this.size - 1 ||
            ind % this.size === 0 ||
            ind % this.size === this.size - 1
                ? 1
                : 0
        );
    }

    public divergenceVector(factor: number = 1): Float64Array {
        const divVector = new Float64Array(this.vectorSize);
        // we calculate divergence of given cell by sum of derivative
        // of x and y velocity components around given cell center.
        // we treat velocity as 0 when it's between solid/fluid cells,
        // as nothing can flow between the walls
        const lastFieldPos = this.size - 1;
        for (let iCell = 0; iCell < this.vectorSize; iCell++) {
            if (this.solidsVector[iCell] === 1) {
                continue;
            }
            const velX = this.velX[iCell];
            const velY = this.velY[iCell];

            const velX2 = this.velX[iCell + 1];
            const velY2 = this.velY[iCell + this.size];

            divVector[iCell] = factor * (velX2 - velX + velY2 - velY);
        }

        return divVector;
    }

    public interpolatePressure(p: Point) {
        const minCellP = [Math.floor(p[0]), Math.floor(p[1])];
        // pressure is located on the middle of the cell
        const relToCenter = [p[0] - minCellP[0], p[1] - minCellP[1]];

        const range = [0, 1];
        let weightSum = 0;
        let resultPressure = 0;
        for (const offsetX of range) {
            for (const offsetY of range) {
                const neighPos: Point = [
                    minCellP[0] + offsetX,
                    minCellP[1] + offsetY,
                ];
                this.assert(neighPos);

                const ind = this.index(neighPos);
                if (this.solidsVector[ind] === 1) {
                    continue;
                }
                const neighPressure = this.pressureVector[ind];
                const velWeight =
                    (offsetX === 0 ? 1 - relToCenter[0] : relToCenter[0]) *
                    (offsetY === 0 ? 1 - relToCenter[1] : relToCenter[1]);

                weightSum += velWeight;
                resultPressure = resultPressure + neighPressure * velWeight;
            }
        }

        return weightSum === 0 ? 0 : resultPressure / weightSum;
    }

    public interpolateVelocity(p: Point): Vector {
        return [
            this.interpolateVelocityAt([p[0] + 0.5, p[1]], VectorComponent.x),
            this.interpolateVelocityAt([p[0], p[1] + 0.5], VectorComponent.y),
        ];
    }

    public randomizeField() {
        const rand = () => RandomRange / 2 - RandomRange * Math.random();
        type RandomMethod = [(ind: number) => number, (ind: number) => number];
        const methods: RandomMethod[] = [
            // random
            [
                () => DefaultRange - 2 * Math.random() * DefaultRange + rand(),
                () => DefaultRange - 2 * Math.random() * DefaultRange + rand(),
            ],
            // left -> right
            [
                ind =>
                    (ind % this.size < this.size / 2 ? DefaultRange : 0) +
                    rand(),
                () => rand(),
            ],
            // many circles
            [
                ind =>
                    Math.cos(
                        (0.2 *
                            (2 * Math.PI * (ind % this.size) * DefaultRange)) /
                            this.size
                    ) + rand(),
                ind =>
                    Math.sin(
                        (0.05 *
                            (2 *
                                Math.PI *
                                Math.floor(ind / this.size) *
                                DefaultRange)) /
                            this.size
                    ) + rand(),
            ],
            // curl
            [
                ind =>
                    DefaultRange *
                        (-1 + Math.floor(ind / this.size) / (0.5 * this.size)) +
                    rand(),
                ind =>
                    -DefaultRange *
                        (-1 + (ind % this.size) / (0.5 * this.size)) +
                    rand(),
            ],
        ];
        const randMethod = methods[Math.floor(Math.random() * methods.length)];
        this.velX = this.velX.map((_, ind) =>
            this.solidsVector[ind] === 1 || this.solidsVector[ind - 1] === 1
                ? 0
                : randMethod[0](ind)
        );
        this.velY = this.velY.map((_, ind) =>
            this.solidsVector[ind] === 1 ||
            this.solidsVector[ind - this.size] === 1
                ? 0
                : randMethod[1](ind)
        );
    }

    public index(p: Point) {
        return p[1] * this.size + p[0];
    }

    public coords(index: number): Point {
        return [index % this.size, Math.floor(index / this.size)];
    }

    // assert given point have proper coords inside our map coords.
    // it should always be true, but I use the function for
    // debugging purposes. it's body should be empty in final code
    public assert(p: Point) {
        if (
            p[0] < -0.5 ||
            p[0] > this.size - 0.5 ||
            p[1] < -0.5 ||
            p[1] > this.size - 0.5
        ) {
            throw new Error(
                `Point (${p[0]}, ${
                    p[1]
                }) is outside legal map coords. There must be an error in the code.`
            );
        }
    }

    private interpolateVelocityAt(p: Point, cmp: VectorComponent): number {
        const velVector = cmp === VectorComponent.x ? this.velX : this.velY;

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

                this.assert(neighPos);

                const neighInd = this.index(neighPos);

                const neighCmpVel = velVector[neighInd];
                const cmpVelWeight =
                    (offsetX === 0 ? 1 - relToCell[0] : relToCell[0]) *
                    (offsetY === 0 ? 1 - relToCell[1] : relToCell[1]);
                weightSum += cmpVelWeight;
                resultVel += neighCmpVel * cmpVelWeight;
            }
        }

        return weightSum === 0 ? 0 : resultVel / weightSum;
    }
}
