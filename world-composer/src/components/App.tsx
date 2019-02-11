import React, { Component } from 'react';
import './App.scss';
import WeatherCanvas from './canvas/WeatherCanvas';
import { Atmosphere } from '../utils/AtmosphereData';
import { ipcRenderer } from '../electron-bridge';

const WorldRadius = 17;
const atmosphereSample: Atmosphere = new Atmosphere(WorldRadius);

class App extends Component<{}, { number: number }> {
    public componentDidMount() {
        ipcRenderer.send('main-window-ready');
    }

    public render() {
        return (
            <div className="app">
                <WeatherCanvas atmosphere={atmosphereSample} />
            </div>
        );
    }
}

export default App;
