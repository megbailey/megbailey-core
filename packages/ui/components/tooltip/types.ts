import type { ReactNode } from "react";

export type TooltipType = "icon" | "wrapper" | string;
export type TooltipPosition = "top" | "bottom" | "left" | "right" | string;
export type TooltipTheme = "dark" | "light" | string;

export type TooltipProps = {
    className?: string;
    text: string;
    children?: ReactNode;
    type?: TooltipType;
    iconName?: string;
    position?: TooltipPosition;
    theme?: TooltipTheme;
    arrow?: boolean;
    showTip?: boolean;
};
