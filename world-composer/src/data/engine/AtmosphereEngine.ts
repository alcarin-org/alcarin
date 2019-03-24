import * as MACGrid from '../atmosphere/MACGrid';
import {
    precalcNeighboursMatrix,
    calculateFieldPressure,
    convectVelocity,
    adjustVelocityFromPressure,
    traceBackParticleVelocity,
} from './EngineUtils';
import { memoizeOnce } from '../../utils/Immutable';

import { Point, multiply, add } from '../../utils/Math';

interface EngineUpdateResult {
    grid: MACGrid.MACGridData;
    artifacts: {
        pressureVector: Float32Array;
    };
}

const precalcNeighbours = memoizeOnce(
    grid => grid.solids,
    precalcNeighboursMatrix
);

export function convectValue<T>(
    grid: MACGrid.MACGridData,
    deltaTime: DOMHighResTimeStamp,
    p: Point,
    valueFromPos: (p: Point) => T
) {
    const vel = traceBackParticleVelocity(grid, p, deltaTime);
    const pos = add(p, multiply(vel, deltaTime));

    return valueFromPos(pos);
}

export function update(
    grid: MACGrid.MACGridData,
    deltaTimeSec: DOMHighResTimeStamp
): EngineUpdateResult {
    const convectedGrid = convectVelocity(grid, deltaTimeSec);
    const neightboursMatrix = precalcNeighbours(convectedGrid);
    // this.applyExternalForces(deltaTimeSec);
    const fieldPressure = calculateFieldPressure(
        convectedGrid,
        neightboursMatrix,
        deltaTimeSec
    );
    const newMACGrid = adjustVelocityFromPressure(
        convectedGrid,
        fieldPressure,
        deltaTimeSec
    );
    return {
        grid: newMACGrid,
        artifacts: {
            pressureVector: calculateFieldPressure(
                convectedGrid,
                neightboursMatrix
            ),
        },
    };
}

//     public applyExternalForces(deltaTime: DOMHighResTimeStamp) {
//         // const halfP: Point = [
//         //     -Math.trunc(this.grid.size / 2),
//         //     -Math.trunc(this.grid.size / 2),
//         // ];
//         // for (let i = 0; i < this.grid.solids.length; i++) {
//         //     if (this.grid.solids[i] === 1) {
//         //         continue;
//         //     }
//         //     const coords = MACGrid.coords(this.grid, i);
//         //     const vx = add([coords[0] - 0.5, coords[1]], halfP);
//         //     const vy = add([coords[0], coords[1] - 0.5], halfP);
//         //     const corFactor = 0.01;
//         //     const corX = multiply(
//         //         normalize(perpendicular(vx)),
//         //         corFactor * deltaTime
//         //     );
//         //     const corY = multiply(
//         //         normalize(perpendicular(vy)),
//         //         corFactor * deltaTime
//         //     );
//         //     const centrFactor = 0.2;
//         //     const centrX = multiply(normalize(vx), centrFactor * deltaTime);
//         //     const centrY = multiply(normalize(vy), centrFactor * deltaTime);
//         //     this.grid.field.velX[i] += centrX[0] + corX[0];
//         //     this.grid.field.velY[i] += centrY[1] + corY[0];
//         // }
//         // gravity
//         // for (let i = 0; i < this.atmo.vectorSize; i++) {
//         //     if (this.atmo.solids[i] === 1) {
//         //         continue;
//         //     }
//         //     this.atmo.velY[i] += deltaTime * 1;
//         // }
//     }
// }
