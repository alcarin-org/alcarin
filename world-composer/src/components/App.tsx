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

const autopause = false;
const stepTimeout = 100;

const WorldRadius = 6;
const atmosphereSample = new Atmosphere(WorldRadius);
atmosphereSample.randomizeField();
const pressureAtmoSystem = new VelocityDrivenAtmo(atmosphereSample);

function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);
    const [coriolisMagnitude, setCoriolisMagnitude] = useState(0.05);
    const [centrifugalMagnitude, setCentrifugalMagnitude] = useState(0.05);
    const [clickedNodePos, setClickedNodePos] = useState([0, 0] as Point);
    const [mapType, setMapType] = useState(MapType.Pressure);
    const [drawRealInterpolation, setDrawRealInterpolation] = useState(false);
    const [drawGrid, setDrawGrid] = useState(false);

    const [atmo, pause, setPause, fps] = useEvolveEngine(
        centrifugalMagnitude,
        coriolisMagnitude
    );

    function onMapTypeChange(ev: FormEvent<HTMLInputElement>) {
        setMapType(parseInt(ev.currentTarget.value, 10));
    }

    function onAtmoClick(p: Point) {
        setClickedNodePos(p);
    }

    function onDrawRealInterpoltation(ev: FormEvent<HTMLInputElement>) {
        setDrawRealInterpolation(ev.currentTarget.checked);
    }

    function onDrawGrid(ev: FormEvent<HTMLInputElement>) {
        setDrawGrid(ev.currentTarget.checked);
    }

    return (
        <div className="app">
            <WeatherCanvas
                atmosphere={atmo}
                onClick={onAtmoClick}
                mapType={mapType}
                drawRealInterpolation={drawRealInterpolation}
                drawGrid={drawGrid}
            />
            <Stats atmosphere={atmo} mouseOver={clickedNodePos} fps={fps} />
            <button onClick={() => setPause(!pause)}>Play/Pause</button>
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
    coriolisMagnitude: number
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
                if (autopause) {
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
