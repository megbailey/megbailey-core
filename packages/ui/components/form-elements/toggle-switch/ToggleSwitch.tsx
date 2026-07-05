import { useState, type MouseEvent } from "react";
import clsx from "clsx";

import type { ToggleSwitchProps } from "./types";

export type { ToggleSwitchChangeEvent, ToggleSwitchProps } from "./types";

export const propValues = {
    initialValue: [true, false],
};

const ToggleSwitch = (props: ToggleSwitchProps) => {
    const {
        label,
        helperText,
        initialValue = false,
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
                    <span className="toggle-switch__helper-text">{helperText}</span>
                </div>
            )}
        </div>
    );
};

export default ToggleSwitch;
