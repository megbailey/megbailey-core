import type { HTMLAttributes } from "react";

export type ButtonSelectOptionValue = string | number | boolean;

export type ButtonSelectOption =
    ButtonSelectOptionValue | { label: string; value: ButtonSelectOptionValue };

export type ButtonSelectTheme = "primary" | "secondary" | "danger" | "success";

export type ButtonSelectProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
    label?: string;
    options?: ButtonSelectOption[];
    theme?: ButtonSelectTheme | string;
    initialValue?: ButtonSelectOptionValue | ButtonSelectOptionValue[] | null;
    onChange?: (value: ButtonSelectOptionValue | ButtonSelectOptionValue[] | null) => void;
    isDisabled?: boolean;
    isMulti?: boolean;
    capitalizeOptions?: boolean;
};
