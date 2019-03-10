import './App.scss';

import React, { useEffect, useState, useMemo, useCallback } from 'react';

import Context, { SimulationContext } from './SimulationContext';
import { InteractiveMap, MapSettings, MapStats } from './map/InteractiveMap';
import { MapType } from './canvas/utils/CanvasUtils';
import * as MACGrid from '../data/atmosphere/MACGrid';
import * as RandomizeField from '../data/atmosphere/RandomizeField';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';
import { ParticlesEngine } from '../data/engine/ParticlesEngine';
import { round, Point } from '../utils/Math';
import { ipcRenderer } from '../electron-bridge';
import Stats from './Stats';
import { MainToolbar } from './MainToolbar';

const WorldSize = 20;

export function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);

    const [atmoGrid, setAtmoGrid] = useState(() => MACGrid.create(WorldSize));
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
        onMapReset(method, true, true);
    }

    function onMapReset(
        randomMethod?: RandomizeField.RandomMethod,
        preserveParticles?: boolean,
        preserveSolids?: boolean
    ) {
        const newGrid = MACGrid.create(
            WorldSize,
            preserveSolids ? atmoGrid.solids : undefined,
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
            if (mapSettings.mapType === MapType.Wall) {
                return;
            }
            const deltaTimeSec = deltaTime / 1000;
            particlesEngine.update(deltaTimeSec);
            atmoEngine.update(deltaTimeSec);
        },
        [atmoEngine, particlesEngine, mapSettings]
    );

    function onMapStatsUpdated(stats: MapStats) {
        setRenderFps(stats.renderFps);
    }

    function onWallToggle(mapPos: Point, value: boolean) {
        if (mapSettings.mapType === MapType.Wall) {
            const gridPos = round(mapPos);
            atmoEngine.toggleSolid(gridPos, value);
        }
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
                            onWallToggle={onWallToggle}
                        />
                    </div>
                </div>
            </div>
        </Context.Provider>
    );
}
