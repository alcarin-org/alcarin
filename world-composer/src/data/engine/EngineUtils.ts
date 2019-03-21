import * as MACGrid from '../atmosphere/MACGrid';
import {
    Point,
    multiply,
    add,
    Vector,
    resolveLinearByJacobi,
} from '../../utils/Math';

const relNeighbours: Vector[] = [[-1, 0], [1, 0], [0, -1], [0, 1]];

// neighbours matrix for every cell show negative number of non-solid neighbours
// for given cell and "1" for the cell neighbours. other cells are marked as "0".
// it only include fluid cells
export function precalcNeighboursMatrix(grid: MACGrid.MACGridData): Int8Array {
    const vectorSize = grid.size ** 2;
    const matrix = new Int8Array(vectorSize ** 2);

    for (let iCell = 0; iCell < vectorSize; iCell++) {
        if (grid.solids[iCell] === 1) {
            continue;
        }

        const rowOffset = iCell * vectorSize;
        const p = MACGrid.coords(grid, iCell);

        let neighboursCount = 0;
        for (const relPos of relNeighbours) {
            const nPos = add(p, relPos);
            const nIndex = MACGrid.index(grid, nPos);
            if (grid.solids[nIndex] === 0) {
                matrix[rowOffset + nIndex] = 1;
                neighboursCount++;
            }
        }
        matrix[rowOffset + iCell] = -neighboursCount;
    }
    return matrix.filter(
        (_, ind) =>
            grid.solids[Math.floor(ind / vectorSize)] === 0 &&
            grid.solids[ind % vectorSize] === 0
    );
}

export function calculateFieldPressure(
    grid: MACGrid.MACGridData,
    neighboursMatrix: Int8Array,
    deltaTime: DOMHighResTimeStamp = 1
) {
    const fieldDivergenceVector = MACGrid.divergenceVector(grid, 1 / deltaTime);
    const fluidCellsDivergenceVector = fieldDivergenceVector.filter(
        (_, ind) => grid.solids[ind] === 0
    );

    const neighboursMatrixA = neighboursMatrix;
    const divergenceVectorB = fluidCellsDivergenceVector;

    const fluidPressureSolveVector = resolveLinearByJacobi(
        neighboursMatrixA,
        divergenceVectorB
    );

    let iFluidCellInd = 0;
    const globalPressureVector = new Float32Array(grid.size ** 2);
    globalPressureVector.forEach((_, ind, pressure) => {
        pressure[ind] =
            grid.solids[ind] === 1
                ? 0
                : fluidPressureSolveVector[iFluidCellInd++];
    });
    return globalPressureVector;
}

export function convectVelocity(
    grid: MACGrid.MACGridData,
    deltaTime: DOMHighResTimeStamp
) {
    const newVelX = grid.field.velX.map((_, ind) => {
        const p = MACGrid.coords(grid, ind);

        // we expecting that a walls are on entire left border of the map
        return grid.solids[ind] === 1 || grid.solids[ind - 1] === 1
            ? 0
            : traceBackParticleVelocity(grid, [p[0] - 0.5, p[1]], deltaTime)[0];
    });

    const newVelY = grid.field.velX.map((_, ind) => {
        const p = MACGrid.coords(grid, ind);
        // we expecting that a walls are on entire top border of the map
        return grid.solids[ind] === 1 || grid.solids[ind - grid.size] === 1
            ? 0
            : traceBackParticleVelocity(grid, [p[0], p[1] - 0.5], deltaTime)[1];
    });

    return {
        ...grid,
        field: {
            velX: newVelX,
            velY: newVelY,
        },
    };
}

export function traceBackParticleVelocity(
    grid: MACGrid.MACGridData,
    p: Point,
    deltaTime: DOMHighResTimeStamp
): Point {
    const v = MACGrid.interpolateVelocity(grid, p);
    const lastKnownP: Point = add(p, multiply(v, -0.5 * deltaTime));
    const avVelocity = MACGrid.interpolateVelocity(grid, lastKnownP);

    const particlePos = add(p, multiply(avVelocity, -deltaTime));
    return MACGrid.interpolateVelocity(grid, particlePos);
}

export function adjustVelocityFromPressure(
    grid: MACGrid.MACGridData,
    gridPressureVector: Float32Array,
    deltaTime: DOMHighResTimeStamp
): MACGrid.MACGridData {
    const fieldVelX = grid.field.velX.map((vel, ind) => {
        if (grid.solids[ind] === 1) {
            return 0;
        }
        const pos = MACGrid.coords(grid, ind);

        if (process.env.REACT_APP_DEBUG === '1') {
            MACGrid.assert(grid, pos);
            MACGrid.assert(grid, [pos[0] - 1, pos[1]]);
        }

        const posPressure = gridPressureVector[ind];
        const onLeftBorder = grid.solids[ind - 1] === 1;
        const pressureGradientX = onLeftBorder
            ? 0
            : posPressure - gridPressureVector[ind - 1];
        return vel - deltaTime * pressureGradientX;
    });

    const fieldVelY = grid.field.velY.map((vel, ind) => {
        if (grid.solids[ind] === 1) {
            return 0;
        }
        const pos = MACGrid.coords(grid, ind);

        if (process.env.REACT_APP_DEBUG === '1') {
            MACGrid.assert(grid, pos);
            MACGrid.assert(grid, [pos[0], pos[1] - 1]);
        }

        const posPressure = gridPressureVector[ind];
        const onTopBorder = grid.solids[ind - grid.size] === 1;
        const pressureGradientY = onTopBorder
            ? 0
            : posPressure - gridPressureVector[ind - grid.size];
        return vel - deltaTime * pressureGradientY;
    });

    return {
        ...grid,
        field: {
            ...grid.field,
            velX: fieldVelX,
            velY: fieldVelY,
        },
    };
}
