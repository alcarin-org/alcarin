export interface StatsData {
    fps: number;
}

export function create(): StatsData {
    return {
        fps: 0,
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
