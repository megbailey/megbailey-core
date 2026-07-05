import type { HTMLAttributes, MouseEvent } from "react";

export type ToggleSwitchChangeEvent = MouseEvent<HTMLButtonElement> & {
    value: boolean;
};

export type ToggleSwitchProps = Omit<HTMLAttributes<HTMLDivElement>, "onClick"> & {
    label?: string;
    helperText?: string;
    initialValue?: boolean;
    onLabel?: string;
    offLabel?: string;
    onClick?: (event: ToggleSwitchChangeEvent) => void;
};
