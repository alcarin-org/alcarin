import React, { useCallback, useRef, MutableRefObject } from 'react';

import { MapRenderer } from '../canvas/MapRenderer';
import { Atmosphere } from '../../data/Atmosphere';
import { VelocityDrivenAtmo } from '../../data/VelocityDrivenAtmo';
import { MapType } from '../canvas/utils/CanvasUtils';

export interface MapSettings {
    drawFieldSize: number;
    mapType: MapType;
}

export interface MapStats {
    renderFps: number;
}

interface Props {
    atmo: Atmosphere;
    driver: VelocityDrivenAtmo;

    settings: MapSettings;
    onStatsTick?: (stats: MapStats) => void;
}

interface FpsCalc {
    fps: number;
    timeAcc: number;
    fpsAcc: number;
}

export function InteractiveMap({ atmo, driver, settings, onStatsTick }: Props) {
    const fpsRef = useRef<FpsCalc>({
        fps: 0,
        timeAcc: 0,
        fpsAcc: 0,
    });

    const onRender = useCallback(
        (deltaTime: DOMHighResTimeStamp) =>
            calculateFps(fpsRef, deltaTime, onStatsTick),
        [atmo, driver, onStatsTick]
    );

    return (
        <MapRenderer
            atmo={atmo}
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
    onStatsTick: Props['onStatsTick']
) {
    const fpsObj = fpsCalcRef.current;
    fpsObj.timeAcc += deltaTime;
    if (fpsObj.timeAcc >= 1000) {
        fpsObj.fps = fpsObj.fpsAcc;
        fpsObj.fpsAcc = 0;
        fpsObj.timeAcc = fpsObj.timeAcc % 1000;
        if (onStatsTick) {
            onStatsTick({
                renderFps: fpsObj.fps,
            });
        }
        console.log('fps', fpsObj.fps);
    }
    fpsObj.fpsAcc++;
}
