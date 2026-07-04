import { useState, type HTMLAttributes, type MouseEvent } from "react";
import clsx from "clsx";
import Tooltip from "../../tooltip/Tooltip";

import type { ToggleSwitchChangeEvent } from "../types";
import "./ToggleSwitch.css";

export const propValues = {
    initialValue: [true, false],
};

export type ToggleSwitchProps = Omit<HTMLAttributes<HTMLDivElement>, "onClick"> & {
    label?: string;
    helperText?: string;
    initialValue?: boolean;
    tooltip?: boolean;
    onLabel?: string;
    offLabel?: string;
    onClick?: (event: ToggleSwitchChangeEvent) => void;
};

const ToggleSwitch = (props: ToggleSwitchProps) => {
    const {
        label,
        helperText,
        initialValue = false,
        tooltip = false,
        onLabel = "On",
        offLabel = "Off",
        onClick,
        className,
        ...other
    } = props;
    const [switchState, setSwitchState] = useState(initialValue);

    const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
        const nextValue = !switchState;
        if (typeof onClick === "function") {
            onClick(Object.assign(event, { value: nextValue }));
        }
        setSwitchState(nextValue);
    };

    return (
        <div className={clsx("toggle-switch", className)} {...other}>
            {label && (
                <div className="toggle-switch__label">
                    <span dangerouslySetInnerHTML={{ __html: label }}></span>
                </div>
            )}

            <button
                type="button"
                role="switch"
                className={clsx("toggle-switch__track", {
                    "toggle-switch__track--on": switchState,
                })}
                aria-checked={switchState}
                aria-label={label ? undefined : switchState ? onLabel : offLabel}
                onClick={handleToggle}
            >
                <span className="toggle-switch__thumb" aria-hidden="true" />
                <span className="toggle-switch__sr-only">
                    {switchState ? onLabel : offLabel}
                </span>
            </button>

            {helperText && (
                <div className="toggle-switch__helper">
                    {tooltip && <Tooltip position="top" text={helperText} />}
                    {!tooltip && <span className="toggle-switch__helper-text">{helperText}</span>}
                </div>
            )}
        </div>
    );
};

export default ToggleSwitch;
