import { useEffect, useState } from "react";
import clsx from "clsx";

import Icon from "../icon/Icon";

import type { TooltipProps } from "./types";

export type { TooltipPosition, TooltipProps, TooltipTheme, TooltipType } from "./types";

const tooltipClass = "c-tooltip";

export const propValues = {
    type: ["icon", "wrapper"],
    component: ["icon", "button", "form-element"],
    position: ["top", "bottom", "left", "right"],
    theme: ["dark", "light"],
    arrow: [true, false],
};

export const defaultProps = {
    type: "icon",
    component: "icon",
    iconName: "info-circle",
    position: "top",
    theme: "dark",
    arrow: true,
    showTip: false,
};

const Tooltip = ({
    className,
    text,
    children,
    type = defaultProps.type,
    iconName = defaultProps.iconName,
    position = defaultProps.position,
    theme = defaultProps.theme,
    arrow = defaultProps.arrow,
    showTip: initialShowTip = defaultProps.showTip,
}: TooltipProps) => {
    const [showTip, setShowTip] = useState(initialShowTip);

    useEffect(() => {
        setShowTip(initialShowTip);
    }, [initialShowTip]);

    return (
        <span
            className={clsx(tooltipClass, className, {
                [`${tooltipClass}__${type}`]: propValues.component.includes(type) && type,
                [`${tooltipClass}--${position}`]:
                    propValues.position.includes(position) && position,
            })}
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
        >
            {type === "icon" && <Icon size="micro" name={iconName} />}
            {type === "wrapper" && children}
            <span
                className={clsx(`${tooltipClass}__text`, {
                    [`${tooltipClass}__text--no-arrow`]: !arrow,
                    ["show"]: showTip,
                })}
            >
                <span>{text}</span>
            </span>
        </span>
    );
};

export default Tooltip;
