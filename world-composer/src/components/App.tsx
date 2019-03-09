import React, { useEffect, useState } from 'react';

import './App.scss';
import { InteractiveMap, MapSettings, MapStats } from './map/InteractiveMap';
import { MapType } from './canvas/utils/CanvasUtils';
import * as MACGrid from '../data/atmosphere/MACGrid';
import * as RandomizeField from '../data/atmosphere/RandomizeField';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';
import { ParticlesEngine } from '../data/engine/ParticlesEngine';
import { ipcRenderer } from '../electron-bridge';
import Stats from './Stats';
import { MainToolbar } from './MainToolbar';

const WorldSize = 20;

let atmo = MACGrid.create(WorldSize);
let atmoDriver = new AtmosphereEngine(atmo);
let particlesEngine = new ParticlesEngine(atmoDriver);

function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);

    const [isStatsVisible, setIsStatsVisible] = useState(false);

    const [mapSettings, setMapSettings] = useState<MapSettings>({
        drawFieldSize: 25,
        mapType: MapType.Neutral,
    });

    const [renderFps, setRenderFps] = useState(0);

    function onMapTypeChange(mapType: MapType) {
        setMapSettings({ ...mapSettings, mapType });
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
        particlesEngine = new ParticlesEngine(
            atmoDriver,
            particlesEngine.particles
        );
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
            <div className="app__toolbar">
                <MainToolbar
                    mapSettings={mapSettings}
                    onRandomizeVelocity={randomizeMap}
                    statsVisible={isStatsVisible}
                    onToggleStats={newState => setIsStatsVisible(newState)}
                    onMapTypeChange={onMapTypeChange}
                    onSpawnParticles={spawnParticles}
                />
            </div>
            <div className="app__content">
                {isStatsVisible && (
                    <div className="app__stats-panel">
                        <Stats
                            particlesEngine={particlesEngine}
                            atmoDriver={atmoDriver}
                            atmosphere={atmo}
                            mouseOver={[0, 0]}
                            fps={renderFps}
                        />
                    </div>
                )}
                <div className="app__map">
                    <InteractiveMap
                        atmo={atmo}
                        driver={atmoDriver}
                        particlesEngine={particlesEngine}
                        settings={mapSettings}
                        onTick={onMapRenderTick}
                        onStatsUpdated={onMapStatsUpdated}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
