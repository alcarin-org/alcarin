import './App.scss';

import React, { useEffect, useState, useMemo, useCallback } from 'react';

import Context, { SimulationContext } from './SimulationContext';
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

function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);

    const [atmoGrid, setAtmoGrid] = useState(() =>
        MACGrid.create(WorldSize, debugFieldIsWall)
    );
    const [atmoEngine, setAtmoEngine] = useState(
        () => new AtmosphereEngine(atmoGrid)
    );
    const [particlesEngine, setParticlesEngine] = useState(
        () => new ParticlesEngine(atmoEngine)
    );

    const [isStatsVisible, setIsStatsVisible] = useState(true);

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
        onMapReset(method, true);
    }

    function onMapReset(
        randomMethod?: RandomizeField.RandomMethod,
        preserveParticles?: boolean
    ) {
        const newGrid = MACGrid.create(
            WorldSize,
            debugFieldIsWall,
            randomMethod
        );
        const newEngine = new AtmosphereEngine(newGrid);
        const newParticlesEngine = new ParticlesEngine(
            newEngine,
            preserveParticles ? particlesEngine.particles : undefined
        );

        setAtmoGrid(newGrid);
        setAtmoEngine(newEngine);
        setParticlesEngine(newParticlesEngine);
    }

    const simulationContext = useMemo<SimulationContext>(
        () => ({
            grid: atmoGrid,
            engine: atmoEngine,
        }),
        [atmoGrid, atmoEngine]
    );

    function spawnParticles() {
        particlesEngine.spawnParticles(5000);
    }

    const onRenderTick = useCallback(
        (deltaTime: DOMHighResTimeStamp) => {
            const deltaTimeSec = deltaTime / 1000;
            particlesEngine.update(deltaTimeSec);
            atmoEngine.update(deltaTimeSec);
        },
        [atmoEngine, particlesEngine]
    );

    function onMapStatsUpdated(stats: MapStats) {
        setRenderFps(stats.renderFps);
    }
    return (
        <Context.Provider value={simulationContext}>
            <div className="app">
                <div className="app__toolbar">
                    <MainToolbar
                        mapSettings={mapSettings}
                        onRandomizeVelocity={randomizeMap}
                        statsVisible={isStatsVisible}
                        onToggleStats={newState => setIsStatsVisible(newState)}
                        onMapTypeChange={onMapTypeChange}
                        onSpawnParticles={spawnParticles}
                        onMapReset={() => onMapReset()}
                    />
                </div>
                <div className="app__content">
                    {isStatsVisible && (
                        <div className="app__stats-panel">
                            <Stats
                                particlesEngine={particlesEngine}
                                mouseOver={[0, 0]}
                                fps={renderFps}
                            />
                        </div>
                    )}
                    <div className="app__map">
                        <InteractiveMap
                            particlesEngine={particlesEngine}
                            settings={mapSettings}
                            onTick={onRenderTick}
                            onStatsUpdated={onMapStatsUpdated}
                        />
                    </div>
                </div>
            </div>
        </Context.Provider>
    );
}

function debugFieldIsWall(x: number, y: number, mapSize: number) {
    const centerPos = Math.floor(mapSize / 2);

    return (
        (x === 12 && y < 12) ||
        (x === mapSize - 12 && y < mapSize - 4 && y > 16) ||
        (x > 2 && x < 15 && y === mapSize - 10) ||
        (x === centerPos && y === centerPos)
    );
}

export default App;
