import type { HTMLAttributes, MouseEventHandler, ReactNode } from "react";
import type { IconProps } from "../icon/types";
export type ButtonSize = "small" | "medium" | "large" | "normal";
export type ButtonTheme = "primary" | "secondary" | "danger" | "success";

export type ButtonIconProps = IconProps;

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
    className?: string;
    text?: string;
    href?: string;
    onClick?: MouseEventHandler<any>;
    size?: string;
    theme?: string;
    color?: string;
};

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement | HTMLAnchorElement> {
    className?: string;
    text?: string;
    href?: string;
    onClick?: MouseEventHandler<any>;
    theme?: ButtonTheme | string;
    size?: ButtonSize | string;
    layout?: string;
    active?: boolean;
    target?: string;
    role?: string;
    onKeyDown?: any;
    "aria-expanded"?: boolean;
    "aria-controls"?: string;
    "aria-current"?: any;
    icon?: ButtonIconProps;
    children?: ReactNode;
}
