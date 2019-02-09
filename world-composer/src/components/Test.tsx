import React from 'react';

export default class Test extends React.PureComponent<{}, { value: number }> {
    public state = { value: 1 };

    public render() {
        return (
            <span>
                <button
                    onClick={() =>
                        this.setState(({ value }) => ({ value: value + 1 }))
                    }
                >
                    X
                </button>
                testme {this.state.value}
            </span>
        );
    }
}
