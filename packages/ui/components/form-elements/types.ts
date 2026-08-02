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
