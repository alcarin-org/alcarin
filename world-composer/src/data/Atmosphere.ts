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

const RandomRange = 0;
const DefaultRange = 1;

export class Atmosphere {
    // coded as MAC grid with cell size 1.
    // integer point ((px, py)) represent center of a cell
    // pressure is stored on the center of cell (px, py)
    // velocity X is on the middle of the left face (px - 0.5, py)
    // velocity Y is on the middle of the top face (px, py - 0.5),
    // e.g. velX: (-0.5, 0), velY: (0, -0.5)

    public readonly radius: number;
    public pressureVector: Float64Array;
    // X velocities component, stored on (x-0.5, y) from center of every cell
    public velX: Float64Array;
    // Y velocities component, stored on (x, y-0.5) from center of every cell
    public velY: Float64Array;

    public readonly size: number;
    public readonly vectorSize: number;

    public constructor(radius: number) {
        this.radius = radius;

        this.size = 2 * this.radius - 1;
        this.vectorSize = this.size ** 2;

        this.pressureVector = new Float64Array(this.vectorSize);
        this.velX = new Float64Array(this.vectorSize);
        this.velY = new Float64Array(this.vectorSize);
    }

    public divergenceVector(): Float64Array {
        const divVector = new Float64Array(this.vectorSize);
        // we calculate divergence of given cell by sum of derivative
        // of x and y velocity components around given cell center.
        // we treat velocity as 0 when it's between solid/fluid cells,
        // as nothing can flow between the walls
        for (let iCell = 0; iCell < this.vectorSize; iCell++) {
            const velX = iCell % this.size === 0 ? 0 : this.velX[iCell];
            const velY =
                Math.trunc(iCell / this.size) === 0 ? 0 : this.velY[iCell];

            const rightBorder = iCell % this.size === this.size - 1;
            const bottomBorder =
                Math.trunc(iCell / this.size) === this.size - 1;

            const velX2 = rightBorder ? 0 : this.velX[iCell + 1];
            const velY2 = bottomBorder ? 0 : this.velY[iCell + this.size];

            divVector[iCell] = velX2 - velX + velY2 - velY;
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
                if (!this.contains(neighPos)) {
                    continue;
                }
                const ind = this.index(neighPos);
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
            this.interpolateVelocityAt([p[0], p[1] - 0.5], VectorComponent.x),
            this.interpolateVelocityAt([p[0] - 0.5, p[1]], VectorComponent.y),
        ];
    }

    public randomizeField() {
        const rand = () => RandomRange / 2 - RandomRange * Math.random();
        type RandomMethod = [(ind: number) => number, (ind: number) => number];
        const methods: RandomMethod[] = [
            // random
            // () => [rand(), rand()],
            // left -> right
            [
                ind => (ind % this.size < 0 ? DefaultRange : 0) + rand(),
                () => rand(),
            ],
            // many circles
            [
                ind =>
                    Math.cos(
                        (2 * Math.PI * (ind % this.size) * DefaultRange) /
                            this.size
                    ) + rand(),
                ind =>
                    Math.sin(
                        (2 *
                            Math.PI *
                            Math.floor(ind / this.size) *
                            DefaultRange) /
                            this.size
                    ) + rand(),
            ],
            // curl
            [
                ind => DefaultRange * Math.floor(ind / this.size) + rand(),
                ind => DefaultRange * (-ind % this.size) + rand(),
            ],
        ];
        const randMethod = methods[Math.floor(Math.random() * methods.length)];
        this.velX = this.velX.map((_, ind) => randMethod[0](ind));
        this.velY = this.velY.map((_, ind) => randMethod[1](ind));
    }

    // public forEach(callback: (node: AtmosphereNode, p: Point) => void) {
    //     this.nodes.forEach((node, index) => {
    //         callback(node, this.coords(index));
    //     });
    // }

    public contains(p: Point): boolean {
        return p[0] >= 0 && p[0] < this.size && p[1] >= 0 && p[1] < this.size;
    }

    public index(p: Point) {
        return p[1] * this.size + p[0];
    }

    public coords(index: number): Point {
        return [index % this.size, Math.floor(index / this.size)];
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

                // on right/bottom we have one additional "virtual" speed cmp
                // that is on border
                const cmpOnBorder =
                    neighPos[0] <= 0 ||
                    neighPos[0] >= this.size ||
                    neighPos[1] <= 0 ||
                    neighPos[1] >= this.size;
                if (cmpOnBorder) {
                    continue;
                }
                const neighCmpVel = velVector[this.index(neighPos)];
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
