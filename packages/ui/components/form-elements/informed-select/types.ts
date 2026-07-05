import type React from "react";
import type { FieldProps } from "informed";
import type {
    GroupBase,
    OnChangeValue,
    OptionsOrGroups,
    Props as ReactSelectProps,
    SelectInstance,
} from "react-select";

import type { FormFieldBlurHandler, FormFieldChangeHandler } from "../types";

export type InformedSelectOption = {
    label: string;
    value: string;
};

export type InformedSelectFieldProps = {
    field?: string;
    label?: string;
    helperText?: string;
    forwardedRef?: React.Ref<
        SelectInstance<InformedSelectOption, boolean, GroupBase<InformedSelectOption>>
    >;
    options: OptionsOrGroups<InformedSelectOption, GroupBase<InformedSelectOption>>;
    placeholder?: string;
    isMulti?: boolean;
    isDisabled?: boolean;
    initialValue?:
        | OnChangeValue<InformedSelectOption, boolean>
        | OptionsOrGroups<InformedSelectOption, GroupBase<InformedSelectOption>>;
    formatGroupLabel?: (group: GroupBase<InformedSelectOption>) => React.ReactNode;
};

export type InformedSelectProps = Omit<
    FieldProps<InformedSelectFieldProps>,
    "name" | "onChange" | "onBlur"
> &
    InformedSelectFieldProps &
    Omit<
        ReactSelectProps<InformedSelectOption, boolean, GroupBase<InformedSelectOption>>,
        "value" | "onChange" | "onBlur" | "options" | "isMulti" | "isDisabled" | "inputId"
    > & {
        name?: string;
        onChange?: FormFieldChangeHandler<OnChangeValue<InformedSelectOption, boolean>>;
        onBlur?: FormFieldBlurHandler<OnChangeValue<InformedSelectOption, boolean>>;
    };

export type InformedSelectFieldValue = OnChangeValue<InformedSelectOption, boolean>;
