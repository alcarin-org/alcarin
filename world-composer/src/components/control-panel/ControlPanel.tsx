import React, { useState } from 'react';
import Stats from './Stats';

export enum ControlPanelMode {
    Stats,
    Walls,
}

const TabsDefinition = [
    { mode: ControlPanelMode.Stats, label: 'Statistics' },
    { mode: ControlPanelMode.Walls, label: 'Setup walls' },
];

interface Props {
    onModeChanged?: (mode: ControlPanelMode) => void;
}

export function ControlPanel({ onModeChanged }: Props) {
    const [mode, setMode] = useState(ControlPanelMode.Stats);

    return (
        <div className="control-panel">
            <div className="pure-button-group">
                {TabsDefinition.map(tab => (
                    <button
                        onClick={() => {
                            setMode(tab.mode);
                            if (onModeChanged) {
                                onModeChanged(tab.mode);
                            }
                        }}
                        className={
                            'pure-button' +
                            (mode === tab.mode ? ' pure-button-active' : '')
                        }
                        role="button"
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="control-panel__tabs">
                <div className="control-panel__tab">{renderTab(mode)}</div>
            </div>
        </div>
    );
}

function renderTab(mode: ControlPanelMode) {
    switch (mode) {
        case ControlPanelMode.Stats:
            return <Stats mouseOver={[0, 0]} />;
        default:
            return null;
    }
}
