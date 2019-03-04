import * as MACGrid from '../atmosphere/MACGrid';
import { add, Vector, resolveLinearByJacobi } from '../../utils/Math';

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
    const globalPressureVector = new Float64Array(grid.size ** 2);
    globalPressureVector.forEach((_, ind, pressure) => {
        pressure[ind] =
            grid.solids[ind] === 1
                ? 0
                : fluidPressureSolveVector[iFluidCellInd++];
    });
    return globalPressureVector;
}
