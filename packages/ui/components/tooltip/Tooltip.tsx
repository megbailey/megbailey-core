import { useEffect, useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";

import Icon from "../icon/Icon";

import type { TooltipProps } from "./types";
import { noteTooltipToggle, placeTooltip } from "./placeTooltip";
import "./Tooltip.css";

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
    extendHost = false,
}: TooltipProps) => {
    const [showTip, setShowTip] = useState(initialShowTip);
    const [placed, setPlaced] = useState(false);
    const [heldClosed, setHeldClosed] = useState(false);
    const rootRef = useRef<HTMLSpanElement>(null);
    const tipRef = useRef<HTMLSpanElement>(null);
    const toggles = useRef<number[]>([]);

    useEffect(() => {
        setShowTip(initialShowTip);
    }, [initialShowTip]);

    useLayoutEffect(() => {
        const root = rootRef.current;
        const tip = tipRef.current;
        if (!showTip || !root || !tip) {
            setPlaced(false);
            return;
        }

        const next = placeTooltip(
            root.getBoundingClientRect(),
            tip.getBoundingClientRect(),
            { width: window.innerWidth, height: window.innerHeight },
            position,
            undefined,
            { allowEndOverflow: extendHost }
        );
        tip.style.setProperty("--c-tooltip-top", `${next.top}px`);
        tip.style.setProperty("--c-tooltip-left", `${next.left}px`);
        setPlaced(true);
    }, [showTip, text, position, extendHost]);

    const changeTip = (next: boolean) => {
        const noted = noteTooltipToggle(toggles.current, performance.now());
        toggles.current = noted.times;
        if (noted.latch) {
            setHeldClosed(true);
            setShowTip(false);
            return;
        }
        setShowTip(next);
    };

    return (
        <span
            ref={rootRef}
            className={clsx(tooltipClass, className, {
                [`${tooltipClass}__${type}`]: propValues.component.includes(type) && type,
                [`${tooltipClass}--${position}`]:
                    propValues.position.includes(position) && position,
                [`${tooltipClass}--${theme}`]: propValues.theme.includes(theme) && theme,
            })}
            onMouseEnter={() => {
                if (!heldClosed) changeTip(true);
            }}
            onMouseLeave={() => {
                if (heldClosed) {
                    setHeldClosed(false);
                    toggles.current = [];
                    setShowTip(false);
                    return;
                }
                changeTip(false);
            }}
        >
            {type === "icon" && <Icon size="micro" name={iconName} />}
            {type === "wrapper" && children}
            <span
                ref={tipRef}
                className={clsx(`${tooltipClass}__text`, {
                    [`${tooltipClass}__text--no-arrow`]: !arrow,
                    [`${tooltipClass}__text--placed`]: placed,
                    ["show"]: showTip,
                })}
            >
                <span>{text}</span>
            </span>
        </span>
    );
};

export default Tooltip;
