import * as MACGrid from '../../data/atmosphere/MACGrid';
import { Vector, add, multiply } from '../../utils/Math';

export interface StatsData {
    fps: number;
    avPressure: number;
    avDivergence: number;
    avVelocity: Vector;
}

export function create(): StatsData {
    return {
        fps: 0,
        avPressure: 0,
        avDivergence: 0,
        avVelocity: [0, 0],
    };
}

export function collect(
    statsData: StatsData,
    grid: MACGrid.MACGridData,
    gridPressure: Float32Array
) {
    const divVector = MACGrid.divergenceVector(grid);
    const vectorSize = grid.size ** 2;

    let pressure = 0;
    let totalVelocity: Vector = [0, 0];
    let totalDivergence = 0;

    for (let i = 0; i < grid.size ** 2; i++) {
        totalVelocity = add(totalVelocity, [
            grid.field.velX[i],
            grid.field.velY[i],
        ]);
        pressure += gridPressure[i];
        totalDivergence += divVector[i];
    }
    const avPressure = pressure / vectorSize;
    const avDivergence = totalDivergence / vectorSize;
    const avVelocity = multiply(totalVelocity, 1 / vectorSize);

    return {
        ...statsData,
        avPressure,
        avDivergence,
        avVelocity,
    };
}

export function statsEngineFactory() {
    let timeAccSec = 0;
    let fpsAcc = 0;

    // update stats max once per second
    return function update(
        stats: StatsData,
        deltaTimeSec: DOMHighResTimeStamp
    ) {
        timeAccSec += deltaTimeSec;
        fpsAcc++;

        if (timeAccSec < 1) {
            return stats;
        }

        timeAccSec %= 1;
        const newFps = fpsAcc;
        fpsAcc = 0;

        return { ...stats, fps: newFps };
    };
}
