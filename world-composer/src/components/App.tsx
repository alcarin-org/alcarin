import React, { useEffect, useState, FormEvent } from 'react';

import './App.scss';
import { InteractiveMap, MapSettings, MapStats } from './map/InteractiveMap';
import { MapType } from './canvas/utils/CanvasUtils';
import { Atmosphere } from '../data/Atmosphere';
import { VelocityDrivenAtmo } from '../data/VelocityDrivenAtmo';
// import { Point } from '../utils/Math';
// import { interpolateVelocityAt, evolve, divergence } from '../data/AtmoMotion';
import { ipcRenderer } from '../electron-bridge';
import Stats from './Stats';

const WorldRadius = 14;

const atmo = new Atmosphere(WorldRadius);
const atmoDriver = new VelocityDrivenAtmo(atmo);

function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);

    const [coriolisMagnitude, setCoriolisMagnitude] = useState(0.05);
    const [centrifugalMagnitude, setCentrifugalMagnitude] = useState(0.05);
    // const [clickedNodePos, setClickedNodePos] = useState([0, 0] as Point);
    const [timeStep, setTimeStep] = useState(1);
    // const [drawRealInterpolation, setDrawRealInterpolation] = useState(false);
    // const [drawGrid, setDrawGrid] = useState(false);
    const [autoplay, setAutoplay] = useState(true);
    const [mapSettings, setMapSettings] = useState<MapSettings>({
        drawFieldSize: 25,
        mapType: MapType.Neutral,
    });

    const [_, forceRedraw] = useState(true);

    const [renderFps, setRenderFps] = useState(0);
    const [pause, setPause] = useState(true);

    function onMapTypeChange(ev: FormEvent<HTMLInputElement>) {
        const mapType = parseInt(ev.currentTarget.value, 10);
        setMapSettings({ ...mapSettings, mapType });
    }

    // function onAtmoClick(p: Point) {
    //     setClickedNodePos(p);
    //     setPause(false);
    // }

    function onAutoplay(ev: FormEvent<HTMLInputElement>) {
        setAutoplay(ev.currentTarget.checked);
    }

    function onDrawRealInterpoltation(ev: FormEvent<HTMLInputElement>) {
        // setDrawRealInterpolation(ev.currentTarget.checked);
    }

    function onDrawGrid(ev: FormEvent<HTMLInputElement>) {
        // setDrawGrid(ev.currentTarget.checked);
    }

    function randomizeMap() {
        atmo.randomizeField();
        atmoDriver.calculatePressure(1);
        forceRedraw(!_);
    }

    function onMapRenderTick(deltaTime: DOMHighResTimeStamp) {
        atmoDriver.update(deltaTime / 1000);
    }

    function onMapStatsUpdated(stats: MapStats) {
        setRenderFps(stats.renderFps);
    }

    return (
        <div className="app">
            <InteractiveMap
                atmo={atmo}
                driver={atmoDriver}
                settings={mapSettings}
                onTick={onMapRenderTick}
                onStatsUpdated={onMapStatsUpdated}
            />
            <Stats
                atmoDriver={atmoDriver}
                atmosphere={atmo}
                mouseOver={[0, 0]}
                fps={renderFps}
            />
            <button onClick={randomizeMap}> Random</button>
            <button onClick={() => setPause(!pause)}>Run</button>
            <button onClick={() => atmoDriver.spawnPartcles(5000)}>
                Spawn 5k particles
            </button>

            <label>
                <input
                    type="checkbox"
                    onChange={onAutoplay}
                    checked={autoplay}
                />
                Auto Play
            </label>
            <div className="app__control-panel">
                Map Type:
                <div className="app__input-group">
                    <label>
                        <input
                            type="radio"
                            name="mapType[]"
                            value={MapType.Pressure}
                            checked={mapSettings.mapType === MapType.Pressure}
                            onChange={onMapTypeChange}
                        />{' '}
                        Pressure
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mapType[]"
                            value={MapType.Neutral}
                            checked={mapSettings.mapType === MapType.Neutral}
                            onChange={onMapTypeChange}
                        />{' '}
                        Neutral
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mapType[]"
                            value={MapType.Velocity}
                            checked={mapSettings.mapType === MapType.Velocity}
                            onChange={onMapTypeChange}
                        />{' '}
                        Velocity
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="mapType[]"
                            value={MapType.Divergence}
                            checked={mapSettings.mapType === MapType.Divergence}
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
                    Time step
                    <input
                        type="range"
                        min={1}
                        max={50}
                        step={5}
                        value={timeStep * 10}
                        onChange={ev =>
                            setTimeStep(
                                parseInt(ev.currentTarget.value, 10) / 10
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
                </div>
            </div>
        </div>
    );
}

// function usePause(
//     defPause: boolean
// ): [boolean, (val: boolean) => void, Date, (val: Date) => void] {
//     const [pausedNow, setPaused] = useState(defPause);
//     const [lastPlayDate, setLastPlayDate] = useState(new Date());
//     function setPause(pause: boolean) {
//         if (pause === pausedNow) {
//             return;
//         }

//         setPaused(pause);
//         if (!pause) {
//             setLastPlayDate(new Date());
//         }
//     }
//     return [pausedNow, setPause, lastPlayDate, setLastPlayDate];
// }

// function useEvolveEngine(
//     centrifugalMagnitude: number,
//     coriolisMagnitude: number,
//     timeStep: number,
//     autoplay: boolean
// ): [Atmosphere, boolean, (val: boolean) => void, number] {
//     const [pausedNow, setPaused, lastPlayDate, setLastPlayDate] = usePause(
//         true
//     );
//     const [fps, setFps] = useState(0);
//     const [fpsAcc, setFpsAcc] = useState(0);
//     const [fpsCounter, setFpsCounter] = useState(0);

//     useEffect(
//         () => {
//             if (pausedNow) {
//                 return;
//             }
//             const timeoutId = setTimeout(() => {
//                 const now = new Date();
//                 const timePass =
//                     (now.getTime() - lastPlayDate.getTime()) / 1000;
//                 if (fpsAcc + timePass >= 1) {
//                     setFpsAcc(fpsAcc + timePass - 1);
//                     setFps(fpsCounter);
//                     setFpsCounter(0);
//                 } else {
//                     setFpsAcc(last => last + timePass);
//                     setFpsCounter(counter => counter + 1);
//                 }
//                 atmoDriver.evolve(timePass * timeStep);
//                 if (!autoplay) {
//                     setPaused(true);
//                 }
//                 setLastPlayDate(now);
//             }, stepTimeout);
//             return () => clearTimeout(timeoutId);
//         },
//         [lastPlayDate]
//     );

//     return [atmosphereSample, pausedNow, setPaused, fps];
// }

export default App;
