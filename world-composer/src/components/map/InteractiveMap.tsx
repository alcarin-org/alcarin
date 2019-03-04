import React, { useCallback, useRef, MutableRefObject } from 'react';

import { MapRenderer } from '../canvas/MapRenderer';
import { MACGridData } from '../../data/atmosphere/MACGrid';
import { AtmosphereEngine } from '../../data/engine/AtmosphereEngine';
import { ParticlesEngine } from '../../data/engine/ParticlesEngine';
import { MapType } from '../canvas/utils/CanvasUtils';

export interface MapSettings {
    drawFieldSize: number;
    mapType: MapType;
}

export interface MapStats {
    renderFps: number;
}

interface Props {
    atmo: MACGridData;
    driver: AtmosphereEngine;
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
    atmo,
    driver,
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
        [atmo, driver, onTick]
    );

    return (
        <MapRenderer
            atmo={atmo}
            particlesEngine={particlesEngine}
            driver={driver}
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
