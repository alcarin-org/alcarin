import './App.scss';

import React, { useEffect, useState, useMemo, useCallback } from 'react';

import SimulationContext from './context/SimulationContext';
import { InteractionContextProvider } from './context/InteractionContext';
import { InteractiveMap, MapSettings } from './map/InteractiveMap';
import { MapType } from './canvas/utils/CanvasUtils';
import * as MACGrid from '../data/atmosphere/MACGrid';
import * as RandomizeField from '../data/atmosphere/RandomizeField';
import { AtmosphereEngine } from '../data/engine/AtmosphereEngine';
import { ParticlesEngine } from '../data/engine/ParticlesEngine';
import {
    FluidSourcesEngine,
    FluidSourceType,
} from '../data/engine/FluidSourcesEngine';
import { round, Point } from '../utils/Math';
import { ipcRenderer } from '../electron-bridge';
import { ControlPanel } from './control-panel/ControlPanel';
import { MainToolbar } from './MainToolbar';

const WorldSize = 20;

export function App() {
    useEffect(() => ipcRenderer.send('main-window-ready'), []);

    const [atmoGrid, setAtmoGrid] = useState<MACGrid.MACGridData | null>(null);
    const [atmoEngine, setAtmoEngine] = useState<AtmosphereEngine | null>(null);
    const [
        particlesEngine,
        setParticlesEngine,
    ] = useState<ParticlesEngine | null>(null);
    const [
        sourcesEngine,
        setSourcesEngine,
    ] = useState<FluidSourcesEngine | null>(null);

    useEffect(onMapReset, []);

    const [showControlPanel, setShowControlPanel] = useState(true);

    const [mapSettings, setMapSettings] = useState<MapSettings>({
        drawFieldSize: 25,
        mapType: MapType.Neutral,
    });

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
            preserveSolids && atmoGrid ? atmoGrid.solids : undefined,
            randomMethod
        );
        const newEngine = new AtmosphereEngine(newGrid);
        const newParticlesEngine = new ParticlesEngine(
            newEngine,
            preserveParticles && particlesEngine
                ? particlesEngine.particles
                : undefined
        );
        const newSourcesEngine = new FluidSourcesEngine(
            newEngine,
            newParticlesEngine
            // sourcesEngine
        );
        newEngine.onSimulationTick(deltaTimeSec =>
            newSourcesEngine.update(deltaTimeSec)
        );

        // debug
        newSourcesEngine.registerSource({
            gridPosition: [
                1 + Math.trunc(Math.random() * (newGrid.size - 2)),
                1 + Math.trunc(Math.random() * (newGrid.size - 2)),
            ],
            type: FluidSourceType.Omni,
            power: 15,
            particlesColor: [30, 255, 30, 128],
            particlesPerSecond: 105,
        });

        newSourcesEngine.registerSource({
            gridPosition: [
                1 + Math.trunc(Math.random() * (newGrid.size - 2)),
                1 + Math.trunc(Math.random() * (newGrid.size - 2)),
            ],
            type: FluidSourceType.Sink,
            power: -20,
            particlesColor: [30, 255, 30, 128],
            particlesPerSecond: 0,
        });

        setAtmoGrid(newGrid);
        setAtmoEngine(newEngine);
        setParticlesEngine(newParticlesEngine);
        setParticlesEngine(newParticlesEngine);
        setSourcesEngine(newSourcesEngine);
    }

    const simulationContext = useMemo(
        () =>
            atmoEngine
                ? {
                      grid: atmoGrid!,
                      engine: atmoEngine!,
                      sources: sourcesEngine!,
                      particles: particlesEngine!,
                  }
                : null,
        [atmoGrid, atmoEngine, sourcesEngine]
    );

    function spawnParticles() {
        particlesEngine!.spawnParticles(5000);
    }

    const onRenderTick = useCallback(
        (deltaTime: DOMHighResTimeStamp) => {
            if (mapSettings.mapType === MapType.Wall) {
                return;
            }
            const deltaTimeSec = deltaTime / 1000;
            particlesEngine!.update(deltaTimeSec);
            atmoEngine!.update(deltaTimeSec);
        },
        [atmoEngine, particlesEngine, mapSettings]
    );

    function onWallToggle(mapPos: Point, value: boolean) {
        if (mapSettings.mapType === MapType.Wall) {
            const gridPos = round(mapPos);
            atmoEngine!.toggleSolid(gridPos, value);
        }
    }

    return atmoEngine ? (
        <SimulationContext.Provider value={simulationContext}>
            <InteractionContextProvider>
                <div className="app">
                    <div className="app__toolbar">
                        <MainToolbar
                            mapSettings={mapSettings}
                            onRandomizeVelocity={randomizeMap}
                            controlPanelVisible={showControlPanel}
                            onToggleControlPanel={newState =>
                                setShowControlPanel(newState)
                            }
                            onMapTypeChange={onMapTypeChange}
                            onSpawnParticles={spawnParticles}
                            onMapReset={() => onMapReset()}
                        />
                    </div>
                    <div className="app__content">
                        {showControlPanel && (
                            <div className="app__stats-panel">
                                <ControlPanel />
                            </div>
                        )}
                        <div className="app__map">
                            <InteractiveMap
                                particlesEngine={particlesEngine!}
                                settings={mapSettings}
                                onTick={onRenderTick}
                                onWallToggle={onWallToggle}
                            />
                        </div>
                    </div>
                </div>
            </InteractionContextProvider>
        </SimulationContext.Provider>
    ) : null;
}
