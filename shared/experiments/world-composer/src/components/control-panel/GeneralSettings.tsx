import './Stats.scss';

import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';

import { RootState } from '../../store/rootState';
import actions from '../../store/reducers/settings/actions';

interface Props {
    gridSize: number;
    setTimeFactor: (timeFactor: number) => void;
    setCalcDetailsFactor: (calcDetailsFactor: number) => void;
    timeFactor: number;
    calculationDetailsFactor: number;
}

export const GeneralSettings = connect(
    (state: RootState) => ({
        gridSize: state.simulation.grid.size,
        timeFactor: state.simulation.settings.timeFactor,
        calculationDetailsFactor: state.simulation.settings.calcDetailsFactor,
    }),
    {
        setTimeFactor: actions.setTimeFactor,
        setCalcDetailsFactor: actions.setCalcDetailsFactor,
    }
)(GeneralSettingsComponent);

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
