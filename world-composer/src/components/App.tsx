import React, { useEffect, useState } from 'react';
import './App.scss';
import WeatherCanvas from './canvas/WeatherCanvas';
import * as Atmo from '../data/AtmosphereData';
import { ipcRenderer } from '../electron-bridge';

const WorldRadius = 14;
const atmosphereSample = Atmo.randomizeVelocity(Atmo.create(WorldRadius));

function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);
    const [coriolisMagnitude, setCoriolisMagnitude] = useState(0);
    const [centrifugalMagnitude, setCentrifugalMagnitude] = useState(0);
    const [atmo, setAtmo] = useState(atmosphereSample);

    useEffect(() => {
        const id = setTimeout(() => {
            const newAtmo = Atmo.evolve(
                atmo,
                centrifugalMagnitude,
                coriolisMagnitude
            );
            setAtmo(newAtmo);
        }, 100);
        return () => clearTimeout(id);
    });

    return (
        <div className="app">
            <button
                onClick={() =>
                    setAtmo(Atmo.randomizeVelocity(atmosphereSample))
                }
            >
                Randomize
            </button>
            <label>
                Centrifugal Force
                <input
                    type="range"
                    min={0}
                    max={100}
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
                    max={100}
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
                centrifugalMagnitudeMod={centrifugalMagnitude}
                coriolisMagnitudeMod={coriolisMagnitude}
            />
        </div>
    );
}

export default App;
