import React from "react";
import clsx from "clsx";

import type { IconProps } from "./types";

export type { IconProps, IconSize, IconTheme } from "./types";

const iconPaths: Record<string, React.ReactNode> = {
    "minus-circle": (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
    ),
    "plus-circle": (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
    ),
    file: (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M13 2H6a2 2 0 0 0-2 2 v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
    ),
    "info-circle": (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
    ),
    "trash-can": (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
    ),
};

const Icon = ({
    name,
    size = "normal",
    theme = "regular",
    color,
    className,
}: IconProps) => {
    const svg = iconPaths[name];
    if (!svg) {
        throw new Error(
            `Icon "${name}" not found. Please ensure the icon name is correct and that it has been added to the iconPaths object.`
        );
    }

    const sizeMap: Record<string, string> = {
        micro: "12px",
        small: "16px",
        normal: "24px",
        large: "32px",
        jumbo: "48px",
    };

    const dimension = sizeMap[size] || size;

    const style: React.CSSProperties = {
        width: dimension,
        height: dimension,
        display: "inline-block",
        color: color,
        verticalAlign: "middle",
    };

    return (
        <span className={clsx("icon", `icon--${name}`, className)} style={style}>
            {svg}
        </span>
    );
};

export default Icon;
