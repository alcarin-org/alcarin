import React, {
    useCallback,
    useRef,
    // useContext,
    MutableRefObject,
} from 'react';

import { MapRenderer } from '../canvas/MapRenderer';
import { ParticlesEngine } from '../../data/engine/ParticlesEngine';
import { MapType } from '../canvas/utils/CanvasUtils';
// import Context from '../SimulationContext';

export interface MapSettings {
    drawFieldSize: number;
    mapType: MapType;
}

export interface MapStats {
    renderFps: number;
}

interface Props {
    particlesEngine: ParticlesEngine;

    settings: MapSettings;
    onTick?: (deltaTime: DOMHighResTimeStamp) => void;
    onStatsUpdated?: (stats: MapStats) => void;
}

interface FpsCalc {
    fps: number;
    timeAcc: number;
    fpsAcc: number;
}

export function InteractiveMap({
    settings,
    onTick,
    onStatsUpdated,
    particlesEngine,
}: Props) {
    const fpsRef = useRef<FpsCalc>({
        fps: 0,
        timeAcc: 0,
        fpsAcc: 0,
    });

    const onRender = useCallback(
        (deltaTime: DOMHighResTimeStamp) => {
            if (onTick) {
                onTick(deltaTime);
            }
            calculateFps(fpsRef, deltaTime, onStatsUpdated);
        },
        [onTick]
    );

    return (
        <MapRenderer
            particlesEngine={particlesEngine}
            fieldSizePx={settings.drawFieldSize}
            mapType={settings.mapType}
            onRender={onRender}
        />
    );
}

function calculateFps(
    fpsCalcRef: MutableRefObject<FpsCalc>,
    deltaTime: DOMHighResTimeStamp,
    onStatsUpdated: Props['onStatsUpdated']
) {
    const fpsObj = fpsCalcRef.current;
    fpsObj.timeAcc += deltaTime;
    if (fpsObj.timeAcc >= 1000) {
        fpsObj.fps = fpsObj.fpsAcc;
        fpsObj.fpsAcc = 0;
        fpsObj.timeAcc = fpsObj.timeAcc % 1000;
        if (onStatsUpdated) {
            onStatsUpdated({
                renderFps: fpsObj.fps,
            });
        }
    }
    fpsObj.fpsAcc++;
}
