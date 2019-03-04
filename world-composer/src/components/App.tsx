import React, { useEffect, useState, FormEvent } from 'react';

import './App.scss';
import { InteractiveMap, MapSettings, MapStats } from './map/InteractiveMap';
import { MapType } from './canvas/utils/CanvasUtils';
import * as MACGrid from '../data/atmosphere/MACGrid';
import * as RandomizeField from '../data/atmosphere/RandomizeField';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';
import { ParticlesEngine } from '../data/engine/ParticlesEngine';
import { ipcRenderer } from '../electron-bridge';
import Stats from './Stats';

const WorldSize = 20;

let atmo = MACGrid.create(WorldSize);
let atmoDriver = new AtmosphereEngine(atmo);
let particlesEngine = new ParticlesEngine(atmoDriver);

function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);

    // todo
    const [timeStep, setTimeStep] = useState(1);
    const [mapSettings, setMapSettings] = useState<MapSettings>({
        drawFieldSize: 25,
        mapType: MapType.Neutral,
    });

    const [renderFps, setRenderFps] = useState(0);

    function onMapTypeChange(ev: FormEvent<HTMLInputElement>) {
        const mapType = parseInt(ev.currentTarget.value, 10);
        setMapSettings({ ...mapSettings, mapType });
    }

    function onDrawGrid(ev: FormEvent<HTMLInputElement>) {
        // todo
        // setDrawGrid(ev.currentTarget.checked);
    }

    function randomizeMap() {
        const randomMethods = [
            RandomizeField.Chaotic,
            RandomizeField.GlobalCurl,
            RandomizeField.LeftWave,
            RandomizeField.RightWave,
        ];
        const method =
            randomMethods[Math.floor(Math.random() * randomMethods.length)];
        atmo = MACGrid.create(WorldSize, method);
        atmoDriver = new AtmosphereEngine(atmo);
        particlesEngine = new ParticlesEngine(atmoDriver);
    }

    function spawnParticles() {
        particlesEngine.spawnParticles(5000);
    }

    function onMapRenderTick(deltaTime: DOMHighResTimeStamp) {
        const deltaTimeSec = deltaTime / 1000;
        atmoDriver.update(deltaTimeSec);
        particlesEngine.update(deltaTimeSec);
    }

    function onMapStatsUpdated(stats: MapStats) {
        setRenderFps(stats.renderFps);
    }

    return (
        <div className="app">
            <InteractiveMap
                atmo={atmo}
                driver={atmoDriver}
                particlesEngine={particlesEngine}
                settings={mapSettings}
                onTick={onMapRenderTick}
                onStatsUpdated={onMapStatsUpdated}
            />
            <Stats
                particlesEngine={particlesEngine}
                atmoDriver={atmoDriver}
                atmosphere={atmo}
                mouseOver={[0, 0]}
                fps={renderFps}
            />
            <button onClick={randomizeMap}> Random</button>
            <button onClick={spawnParticles}>Spawn 5k particles</button>

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
                <div className="app__checkboxes">
                    <label>
                        <input type="checkbox" onChange={onDrawGrid} />
                        Draw grid
                    </label>
                </div>
            </div>
        </div>
    );
}

export default App;
