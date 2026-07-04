import { useState, type HTMLAttributes } from "react";
import Tooltip from "../../tooltip/Tooltip";

import type { ToggleSwitchChangeEvent } from "../types";

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
        onLabel = "Yes",
        offLabel = "No",
        onClick,
        ...other
    } = props;
    const [switchState, setSwitchState] = useState(initialValue);

    return (
        <div className="form-element c-form-element--inline" {...other}>
            {label && (
                <span className="form-element__label">
                    <div dangerouslySetInnerHTML={{ __html: label }}></div>
                    {tooltip && helperText && <Tooltip position="right" text={helperText} />}
                </span>
            )}
            <div
                role="switch"
                className="c-switch"
                aria-checked={switchState}
                tabIndex={0}
                onClick={(event) => {
                    const nextValue = !switchState;
                    if (typeof onClick === "function") {
                        onClick(Object.assign(event, { value: nextValue }));
                    }
                    setSwitchState(nextValue);
                }}
            >
                <span className="switch">
                    <span className="c-switch__circle"></span>
                    <span className="c-switch--on" aria-hidden="true">
                        {onLabel}
                    </span>
                    <span className="c-switch--off" aria-hidden="true">
                        {offLabel}
                    </span>
                </span>
            </div>
        </div>
    );
};

export default ToggleSwitch;
