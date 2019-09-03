import './Toolbar.scss';

import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface ButtonProps {
    children: React.ReactNode;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    title?: string;
    active?: boolean;
    disabled?: boolean;
}

export function Toolbar({ children }: Props) {
    return (
        <div className="toolbar pure-button-group pure-form" role="toolbar">
            {children}
        </div>
    );
}

export function ToolbarSeparator() {
    return <div className="toolbar__separator pure-menu-separator" />;
}

export function ToolbarButton({
    children,
    onClick,
    title,
    active,
    disabled,
}: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={
                'toolbar__button pure-button' +
                (active ? ' pure-button-active' : '')
            }
            role="button"
            title={title}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
