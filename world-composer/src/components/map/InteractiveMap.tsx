import './InteractiveMap.scss';

import React, {
    useCallback,
    useRef,
    useContext,
    useState,
    MutableRefObject,
} from 'react';

import { round, Point } from '../../utils/Math';
import { isBufferWall } from '../../data/atmosphere/MACGrid';
import { MapRenderer } from '../canvas/MapRenderer';
import { MapType } from '../canvas/utils/CanvasUtils';
import SimulationContext from '../context/SimulationContext';
import { useInteractionContext } from '../context/InteractionContext';
import { ActionType, Dispatch } from '../context/interaction/reducer';

export interface MapSettings {
    drawFieldSize: number;
    mapType: MapType;
}

export interface MapStats {
    renderFps: number;
}

interface Props {
    settings: MapSettings;
    onTick?: (deltaTime: DOMHighResTimeStamp) => void;
    onWallToggle?: (mapPos: Point, value: boolean) => void;
}

interface FpsCalc {
    fps: number;
    timeAcc: number;
    fpsAcc: number;
}

function updateFpsAction(fps: number) {
    return {
        payload: fps,
        type: ActionType.UpdateFps,
    };
}

export function InteractiveMap({ settings, onTick, onWallToggle }: Props) {
    const fpsRef = useRef<FpsCalc>({
        fps: 0,
        timeAcc: 0,
        fpsAcc: 0,
    });

    const { grid, particles } = useContext(SimulationContext)!;
    const { dispatch } = useInteractionContext();

    const [isCursorOnBuffer, setIsCursorOnBuffer] = useState(false)!;

    const onRender = useCallback(
        (deltaTime: DOMHighResTimeStamp) => {
            if (onTick) {
                onTick(deltaTime);
            }
            calculateFps(fpsRef, deltaTime, dispatch);
        },
        [onTick]
    );

    function eventToMapPosition(ev: React.MouseEvent<HTMLDivElement>) {
        return [
            ev.nativeEvent.offsetX / settings.drawFieldSize - 0.5,
            ev.nativeEvent.offsetY / settings.drawFieldSize - 0.5,
        ] as Point;
    }

    function onMouseMove(ev: React.MouseEvent<HTMLDivElement>) {
        onMapContainerDown(ev);
    }

    function onMapContainerDown(ev: React.MouseEvent<HTMLDivElement>) {
        if (settings.mapType !== MapType.Wall || ev.buttons === 0) {
            return;
        }
        const mapPos = eventToMapPosition(ev);
        const bufferWall = isBufferWall(grid.size, round(mapPos));
        if (bufferWall !== isCursorOnBuffer) {
            setIsCursorOnBuffer(bufferWall);
        }
        if (!bufferWall && onWallToggle) {
            onWallToggle(eventToMapPosition(ev), ev.buttons === 1);
        }
    }

    const pointerMode = !isCursorOnBuffer && settings.mapType === MapType.Wall;
    return (
        <div
            className={
                'interactive-map' +
                (pointerMode ? ' interactive-map--active' : '')
            }
            onMouseDown={onMapContainerDown}
            onMouseMove={onMouseMove}
        >
            <MapRenderer
                particlesEngine={particles}
                fieldSizePx={settings.drawFieldSize}
                mapType={settings.mapType}
                onRender={onRender}
            />
        </div>
    );
}

function calculateFps(
    fpsCalcRef: MutableRefObject<FpsCalc>,
    deltaTime: DOMHighResTimeStamp,
    dispatch: Dispatch
) {
    const fpsObj = fpsCalcRef.current;
    fpsObj.timeAcc += deltaTime;
    if (fpsObj.timeAcc >= 1000) {
        fpsObj.fps = fpsObj.fpsAcc;
        fpsObj.fpsAcc = 0;
        fpsObj.timeAcc = fpsObj.timeAcc % 1000;
        dispatch(updateFpsAction(fpsObj.fps));
    }
    fpsObj.fpsAcc++;
}
