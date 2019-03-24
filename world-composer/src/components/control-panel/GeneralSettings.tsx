import './Stats.scss';

import React, { ChangeEvent } from 'react';

import { connectContext } from '../../context/SimulationContext';

interface Props {
    gridSize: number;
    setTimeFactor: (timeFactor: number) => void;
    setCalcDetailsFactor: (calcDetailsFactor: number) => void;
    timeFactor: number;
    calculationDetailsFactor: number;
}

export const GeneralSettings = connectContext(
    GeneralSettingsComponent,
    ({ state, actions }) => ({
        gridSize: state.simulation.grid.size,
        timeFactor: state.settings.timeFactor,
        setTimeFactor: actions.setTimeFactor,
        calculationDetailsFactor: state.settings.calcDetailsFactor,
        setCalcDetailsFactor: actions.setCalcDetailsFactor,
    })
);

function GeneralSettingsComponent({
    gridSize,
    setTimeFactor,
    timeFactor,
    calculationDetailsFactor,
    setCalcDetailsFactor,
}: Props) {
    const onTimeFactorChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setTimeFactor(parseInt(ev.currentTarget.value, 10) / 10);
    };
    const onCalcDetailsFactorChange = (ev: ChangeEvent<HTMLInputElement>) => {
        setCalcDetailsFactor(parseInt(ev.currentTarget.value, 10));
    };
    return (
        <div className="general-settings">
            <dl>
                <dt>Map size:</dt>
                <dd>
                    {gridSize}x{gridSize}
                </dd>
                <dt>Time factor (x{timeFactor}):</dt>
                <dd>
                    <input
                        type="range"
                        min="1"
                        max="25"
                        value={timeFactor * 10}
                        onChange={onTimeFactorChange}
                    />
                </dd>
                <dt>
                    Calculation details factor (x{calculationDetailsFactor}):
                </dt>
                <dd>
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={calculationDetailsFactor}
                        onChange={onCalcDetailsFactorChange}
                    />
                </dd>
            </dl>
        </div>
    );
}
