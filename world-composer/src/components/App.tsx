import React, { Component } from 'react';
import './App.scss';
import Test from './Test';
import { ipcRenderer } from '../electron-bridge';

class App extends Component<{}, { number: number }> {
    public componentDidMount() {
        ipcRenderer.send('main-window-ready');
    }

    public render() {
        return (
            <div className="app">
                <button onClick={() => ipcRenderer.send('test', 'show me')}>
                    {' '}
                    Test me{' '}
                </button>
                <header className="app__header">
                    <img src={''} className="app__logo" alt="logo" />
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <Test />
                    <a
                        className="App__link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
            </div>
        );
    }
}

export default App;
