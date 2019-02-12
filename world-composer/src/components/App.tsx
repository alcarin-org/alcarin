import React, { useEffect, useState, MouseEvent } from 'react';
import './App.scss';
import WeatherCanvas from './canvas/WeatherCanvas';
import * as Atmo from '../data/AtmosphereData';
import { ipcRenderer } from '../electron-bridge';

const WorldRadius = 20;
const atmosphereSample = Atmo.randomizeField(Atmo.create(WorldRadius));

function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);
    const [coriolisMagnitude, setCoriolisMagnitude] = useState(0.1);
    const [centrifugalMagnitude, setCentrifugalMagnitude] = useState(0);
    const [atmo, setAtmo] = useState(atmosphereSample);
    const [play, setPlay] = useState(true);

    function evolveAtmo() {
        const newAtmo = Atmo.evolve(
            atmo,
            centrifugalMagnitude,
            coriolisMagnitude
        );
        setAtmo(newAtmo);
    }
    useEffect(() => {
        if (play) {
            const id = setTimeout(evolveAtmo, 100);
            return () => clearTimeout(id);
        }
    });

    function onAtmoClick(ev: MouseEvent) {
        const x = Math.floor(ev.nativeEvent.offsetX / 30) - atmo.radius + 1;
        const y = Math.floor(ev.nativeEvent.offsetY / 30) - atmo.radius + 1;
        const newAtmo = Atmo.set(
            atmo,
            { x, y },
            {
                pressure: 0,
                velocity: {
                    x: 1 - 2 * Math.random(),
                    y: 1 - 2 * Math.random(),
                },
            }
        );
        setAtmo(newAtmo);
    }

    return (
        <div className="app">
            <button
                onClick={() => setAtmo(Atmo.randomizeField(atmosphereSample))}
            >
                Randomize
            </button>
            <button onClick={evolveAtmo}>Next step</button>
            <button onClick={() => setPlay(!play)}>Play/Pause</button>
            <label>
                Centrifugal Force
                <input
                    type="range"
                    min={0}
                    max={50}
                    step={0}
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
                    max={50}
                    step={1}
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

export default App;
