import React, { useEffect, useState, MouseEvent, FormEvent } from 'react';

import './App.scss';
import WeatherCanvas from './canvas/WeatherCanvas';
import { MapType } from './canvas/primitives';
import { Atmosphere } from '../data/Atmosphere';
import { Vector, Point } from '../utils/Math';
// import { interpolateVelocityAt, evolve, divergence } from '../data/AtmoMotion';
import { VelocityDrivenAtmo } from '../data/VelocityDrivenAtmo';
import { ipcRenderer } from '../electron-bridge';
import Stats from './Stats';

const stepTimeout = 300;

const WorldRadius = 10;
const DrawFieldSize = 30;

const atmosphereSample = new Atmosphere(WorldRadius);
atmosphereSample.randomizeField();
const pressureAtmoSystem = new VelocityDrivenAtmo(atmosphereSample);

function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);
    const [coriolisMagnitude, setCoriolisMagnitude] = useState(0.05);
    const [centrifugalMagnitude, setCentrifugalMagnitude] = useState(0.05);
    const [clickedNodePos, setClickedNodePos] = useState([0, 0] as Point);
    const [mapType, setMapType] = useState(MapType.Velocity);
    const [drawRealInterpolation, setDrawRealInterpolation] = useState(false);
    const [drawGrid, setDrawGrid] = useState(false);
    const [autoplay, setAutoplay] = useState(true);

    const [_, forceRedraw] = useState(true);

    const [atmo, pause, setPause, fps] = useEvolveEngine(
        centrifugalMagnitude,
        coriolisMagnitude,
        autoplay
    );

    function onMapTypeChange(ev: FormEvent<HTMLInputElement>) {
        setMapType(parseInt(ev.currentTarget.value, 10));
    }

    function onAtmoClick(p: Point) {
        setClickedNodePos(p);
    }

    function onAutoplay(ev: FormEvent<HTMLInputElement>) {
        setAutoplay(ev.currentTarget.checked);
    }

    function onDrawRealInterpoltation(ev: FormEvent<HTMLInputElement>) {
        setDrawRealInterpolation(ev.currentTarget.checked);
    }

    function onDrawGrid(ev: FormEvent<HTMLInputElement>) {
        setDrawGrid(ev.currentTarget.checked);
    }

    function randomizeMap() {
        atmosphereSample.randomizeField();
        forceRedraw(!_);
    }

    return (
        <div className="app">
            <WeatherCanvas
                fieldSizePx={DrawFieldSize}
                atmosphere={atmo}
                onClick={onAtmoClick}
                mapType={mapType}
                drawRealInterpolation={drawRealInterpolation}
                drawGrid={drawGrid}
                selectedNodePosition={clickedNodePos}
            />
            <Stats atmosphere={atmo} mouseOver={clickedNodePos} fps={fps} />
            <button onClick={randomizeMap}>
                {' '}
                Random
            </button>
            <button onClick={() => setPause(!pause)}>Run</button>

            <label>
                <input
                    type="checkbox"
                    onChange={onAutoplay}
                    checked={autoplay}
                />
                Auto Play
            </label>
            <div className="app__control-panel">
                <div className="app__input-group">
                    <label>
                        <input
                            type="radio"
                            name="mapType[]"
                            value={MapType.Pressure}
                            checked={mapType === MapType.Pressure}
                            onChange={onMapTypeChange}
                        />{' '}
                        Pressure
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mapType[]"
                            value={MapType.Velocity}
                            checked={mapType === MapType.Velocity}
                            onChange={onMapTypeChange}
                        />{' '}
                        Velocity
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mapType[]"
                            value={MapType.Divergence}
                            checked={mapType === MapType.Divergence}
                            onChange={onMapTypeChange}
                        />{' '}
                        Divergence
                    </label>
                </div>
                <label>
                    Centrifugal Force
                    <input
                        type="range"
                        min={0}
                        max={500}
                        step={2}
                        value={centrifugalMagnitude * 100}
                        onChange={ev =>
                            setCentrifugalMagnitude(
                                parseInt(ev.currentTarget.value, 10) / 100
                            )
                        }
                    />
                </label>
                <label>
                    Coriolis Force
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={2}
                        value={coriolisMagnitude * 100}
                        onChange={ev =>
                            setCoriolisMagnitude(
                                parseInt(ev.currentTarget.value, 10) / 100
                            )
                        }
                    />
                </label>
                <div className="app__checkboxes">
                    <label>
                        <input
                            type="checkbox"
                            onChange={onDrawRealInterpoltation}
                        />
                        Draw real gradient (slow)
                    </label>
                    <label>
                        <input type="checkbox" onChange={onDrawGrid} />
                        Draw grid
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            onChange={onDrawRealInterpoltation}
                        />
                        Draw real gradient (slow)
                    </label>
                </div>
            </div>
        </div>
    );
}

function usePause(
    defPause: boolean
): [boolean, (val: boolean) => void, Date, (val: Date) => void] {
    const [pausedNow, setPaused] = useState(defPause);
    const [lastPlayDate, setLastPlayDate] = useState(new Date());
    function setPause(pause: boolean) {
        if (pause === pausedNow) {
            return;
        }

        setPaused(pause);
        if (!pause) {
            setLastPlayDate(new Date());
        }
    }
    return [pausedNow, setPause, lastPlayDate, setLastPlayDate];
}

function useEvolveEngine(
    centrifugalMagnitude: number,
    coriolisMagnitude: number,
    autoplay: boolean
): [Atmosphere, boolean, (val: boolean) => void, number] {
    const [pausedNow, setPaused, lastPlayDate, setLastPlayDate] = usePause(
        true
    );
    const [fps, setFps] = useState(0);
    const [fpsAcc, setFpsAcc] = useState(0);
    const [fpsCounter, setFpsCounter] = useState(0);

    useEffect(
        () => {
            if (pausedNow) {
                return;
            }
            const timeoutId = setTimeout(() => {
                const now = new Date();
                const timePass =
                    (now.getTime() - lastPlayDate.getTime()) / 1000;
                if (fpsAcc + timePass >= 1) {
                    setFpsAcc(fpsAcc + timePass - 1);
                    setFps(fpsCounter);
                    setFpsCounter(0);
                } else {
                    setFpsAcc(last => last + timePass);
                    setFpsCounter(counter => counter + 1);
                }
                pressureAtmoSystem.evolve(timePass);
                if (!autoplay) {
                    setPaused(true);
                }
                setLastPlayDate(now);
            }, stepTimeout);
            return () => clearTimeout(timeoutId);
        },
        [lastPlayDate]
    );

    return [atmosphereSample, pausedNow, setPaused, fps];
}

export default App;
