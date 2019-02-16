import React, { useEffect, useState, MouseEvent } from 'react';
import math from 'mathjs';

import './App.scss';
import WeatherCanvas from './canvas/WeatherCanvas';
import { Atmosphere } from '../data/Atmosphere';
import { Vector, Point } from '../utils/Math';
import { interpolateVelocityAt, evolve, divergence } from '../data/AtmoMotion';
import { ipcRenderer } from '../electron-bridge';
import Stats from './Stats';

const WorldRadius = 6;
const atmosphereSample = new Atmosphere(WorldRadius);
atmosphereSample.randomizeField();

function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);
    const [coriolisMagnitude, setCoriolisMagnitude] = useState(0.05);
    const [centrifugalMagnitude, setCentrifugalMagnitude] = useState(0.05);
    const [clickedNodePos, setClickedNodePos] = useState([0, 0] as Point);

    const [atmo, pause, setPause] = useEvolveEngine(
        centrifugalMagnitude,
        coriolisMagnitude
    );

    function onAtmoClick(ev: MouseEvent) {
        const x = ev.nativeEvent.offsetX / 30 - atmo.radius + 1;
        const y = ev.nativeEvent.offsetY / 30 - atmo.radius + 1;

        const cellX = Math.floor(ev.nativeEvent.offsetX / 30) - atmo.radius + 1;
        const cellY = Math.floor(ev.nativeEvent.offsetY / 30) - atmo.radius + 1;
        setClickedNodePos([cellX, cellY]);
    }

    return (
        <div className="app">
            <Stats atmosphere={atmo} mouseOver={clickedNodePos} />
            <button onClick={() => setPause(!pause)}>Play/Pause</button>
            <label>
                Centrifugal Force
                <input
                    type="range"
                    min={0}
                    max={100}
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
            <WeatherCanvas
                atmosphere={atmo}
                onClick={onAtmoClick}
                centrifugalMagnitudeMod={centrifugalMagnitude}
                coriolisMagnitudeMod={coriolisMagnitude}
            />
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
): [Atmosphere, boolean, (val: boolean) => void] {
    const [pausedNow, setPaused, lastPlayDate, setLastPlayDate] = usePause(
        true
    );

    useEffect(
        () => {
            if (pausedNow) {
                return;
            }
            const timeoutId = setTimeout(() => {
                const now = new Date();
                const timePass =
                    (now.getTime() - lastPlayDate.getTime()) / 1000;
                const newAtmo = evolve(
                    atmosphereSample,
                    timePass,
                    centrifugalMagnitude,
                    coriolisMagnitude
                );
                // setPaused(true);
                setLastPlayDate(now);
            }, 50);
            return () => clearTimeout(timeoutId);
        },
        [lastPlayDate]
    );

    return [atmosphereSample, pausedNow, setPaused];
}

export default App;
