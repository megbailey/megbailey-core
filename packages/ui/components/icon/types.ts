export type IconSize = "micro" | "small" | "normal" | "large" | "jumbo" | string;
export type IconTheme = "solid" | "regular" | string;

export interface IconProps {
    name: string;
    size?: IconSize;
    theme?: IconTheme;
    color?: string;
    className?: string;
}
