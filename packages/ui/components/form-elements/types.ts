import type { FocusEvent, SyntheticEvent } from "react";

export type FormFieldChangeEvent<TValue> = {
    value: TValue;
    name?: string;
    field?: string;
};

export type FormFieldBlurHandler<TValue> = (
    event: FormFieldChangeEvent<TValue>,
    nativeEvent: FocusEvent
) => void;

export type FormFieldChangeHandler<TValue> = (
    event: FormFieldChangeEvent<TValue>,
    nativeEvent?: SyntheticEvent
) => void;

export function isCallableFunction<T extends (...args: never[]) => unknown>(
    func: unknown,
    label = "Callback"
): func is T {
    if (func && typeof func === "function") {
        return true;
    }
    console.warn(`${label} prop is not a callable function.`);
    return false;
}
