import React, { forwardRef } from "react";
import clsx from "clsx";
import Icon from "../icon/Icon";

import type { ButtonProps } from "./types";
import "./Button.css";

export type { ButtonIconProps, ButtonProps, ButtonSize, ButtonTheme } from "./types";

const Button = forwardRef<any, ButtonProps>(({
    className,
    text,
    href,
    target,
    onClick,
    theme,
    size,
    layout,
    active,
    icon,
    children,
    ...other
}, ref ) => {
    const btnClasses = clsx(
        "btn",
        theme && `btn--${theme}`,
        size && `btn--${size}`,
        layout && `btn--${layout}`,
        {
            "btn--active": active,
        },
        className
    );

    const buttonContent = (
        <>
            {icon && (
                <Icon name={icon.name} size={icon.size} theme={icon.theme} color={icon.color} />
            )}
            {text && <span>{text}</span>}
            {children}
        </>
    );

    if (href) {
        return (
            <a
                ref={ref}
                className={btnClasses}
                href={href}
                onClick={onClick}
                target={target}
                {...(other as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
            >
                {buttonContent}
            </a>
        );
    }

    return (
        <button
            ref={ref}
            type="button"
            className={btnClasses}
            onClick={onClick}
            {...(other as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
            {buttonContent}
        </button>
    );
});

Button.displayName = "Button";

export default Button;
