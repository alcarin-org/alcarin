import { Point, Vector } from '../../utils/Math';
import { VelocityField } from './VelocityField';
import { RandomMethod } from './RandomizeField';

// "Marker and Cell grid", google it for more details
export interface MACGridData {
    // fluid simulation field coded as MAC grid with cell size 1.
    // integer point ((px, py)) represent center of a cell
    // pressure is stored on the center of cell (px, py)
    // velocity X is on the middle of the left face (px - 0.5, py)
    // velocity Y is on the middle of the top face (px, py - 0.5),
    // e.g. velX: (-0.5, 0), velY: (0, -0.5)
    // the map is surronded by 1 cell solids buffer

    // pressure is dynamic value that is calculated based on current velocity
    // values

    // X velocities component, stored on (x-0.5, y) from center of every cell
    // Y velocities component, stored on (x, y-0.5) from center of every cell
    field: VelocityField;

    // solids is coded as 1/0 values vector
    solids: Int8Array;

    // the assumption is that the field is a square, so we need only one
    // size factor
    readonly size: number;
}

export function create(
    mapSize: number,
    solidsVector?: Int8Array,
    fieldInitMethod?: RandomMethod
): MACGridData {
    // we create additionall buffer of solids around our map
    const size = mapSize + 2;
    const vectorSize = size ** 2;

    const solids =
        solidsVector ||
        new Int8Array(vectorSize).map((_, ind) => {
            // prefedined solids for now, should be dynamic later.

            const x = ind % size;
            const y = Math.floor(ind / size);
            return isBufferWall(size, [x, y]) ? 1 : 0;
        });

    const grid: MACGridData = {
        field: {
            velX: new Float32Array(vectorSize),
            velY: new Float32Array(vectorSize),
        },
        solids,
        size,
    };

    if (fieldInitMethod) {
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                const vel = fieldInitMethod(grid, [x, y]);
                const ind = index(grid, [x, y]);
                const onLeftBorder = solids[ind] === 1 || solids[ind - 1] === 1;
                const onTopBorder =
                    solids[ind] === 1 || solids[ind - size] === 1;
                grid.field.velX[ind] = onLeftBorder ? 0 : vel[0];
                grid.field.velY[ind] = onTopBorder ? 0 : vel[1];
            }
        }
    }

    return grid;
}

export function isBufferWall(gridSize: number, [x, y]: Point) {
    return y === 0 || y === gridSize - 1 || x === 0 || x === gridSize - 1;
}

export function divergenceVector(
    grid: MACGridData,
    multiplier: number = 1
): Float32Array {
    const divVector = new Float32Array(grid.solids.length);
    // we calculate divergence of given cell by sum of derivative
    // of x and y velocity components around given cell center.
    // we treat velocity as 0 when it's between solid/fluid cells,
    // as nothing can flow between the walls
    for (let iCell = 0; iCell < grid.solids.length; iCell++) {
        if (grid.solids[iCell] === 1) {
            continue;
        }
        const velX = grid.field.velX[iCell];
        const velY = grid.field.velY[iCell];

        const velX2 = grid.field.velX[iCell + 1];
        const velY2 = grid.field.velY[iCell + grid.size];

        divVector[iCell] = multiplier * (velX2 - velX + velY2 - velY);
    }

    return divVector;
}

export function index(grid: MACGridData, p: Point) {
    return p[1] * grid.size + p[0];
}

export function coords(grid: MACGridData, index: number): Point {
    return [index % grid.size, Math.floor(index / grid.size)];
}

export function assert(grid: MACGridData, p: Point) {
    if (process.env.REACT_APP_DEBUG !== '1') {
        console.warn('Asserting when not in debug mode.');
    }
    if (
        p[0] < -0.5 ||
        p[0] > grid.size - 0.5 ||
        p[1] < -0.5 ||
        p[1] > grid.size - 0.5
    ) {
        throw new Error(
            `Point (${p[0]}, ${
                p[1]
            }) is outside legal map coords. There must be an error in the code.`
        );
    }
}

export function interpolateVelocity(grid: MACGridData, p: Point): Vector {
    return [
        interpolateVelocityAt(grid, [p[0] + 0.5, p[1]], grid.field.velX),
        interpolateVelocityAt(grid, [p[0], p[1] + 0.5], grid.field.velY),
    ];
}

function interpolateVelocityAt(
    grid: MACGridData,
    p: Point,
    velVector: Float32Array
): number {
    // tslint:disable no-bitwise
    const minCellP = [~~p[0], ~~p[1]];
    const relToCell = [p[0] - minCellP[0], p[1] - minCellP[1]];

    let weightSum = 0;
    let resultVel = 0;

    for (let offsetX = 0; offsetX < 2; offsetX++) {
        for (let offsetY = 0; offsetY < 2; offsetY++) {
            const neighPos: Point = [
                minCellP[0] + offsetX,
                minCellP[1] + offsetY,
            ];

            if (process.env.REACT_APP_DEBUG === '1') {
                assert(grid, neighPos);
            }

            const neighInd = index(grid, neighPos);

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

export function interpolatePressure(
    grid: MACGridData,
    pressureVector: Float32Array,
    p: Point
) {
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

            if (process.env.REACT_APP_DEBUG === '1') {
                assert(grid, neighPos);
            }

            const ind = index(grid, neighPos);
            if (grid.solids[ind] === 1) {
                continue;
            }
            const neighPressure = pressureVector[ind];
            const velWeight =
                (offsetX === 0 ? 1 - relToCenter[0] : relToCenter[0]) *
                (offsetY === 0 ? 1 - relToCenter[1] : relToCenter[1]);

            weightSum += velWeight;
            resultPressure = resultPressure + neighPressure * velWeight;
        }
    }

    return weightSum === 0 ? 0 : resultPressure / weightSum;
}
