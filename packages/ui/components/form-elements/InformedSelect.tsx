import React from "react";
import { useField, type FieldProps } from "informed";
import ReactSelect, {
    type GroupBase,
    type OnChangeValue,
    type OptionsOrGroups,
    type Props as ReactSelectProps,
    type SelectInstance,
} from "react-select";
import clsx from "clsx";
import uniqid from "uniqid";

import type { FormFieldBlurHandler, FormFieldChangeHandler } from "./types";

export type InformedSelectOption = {
    label: string;
    value: string;
};

type InformedSelectFieldProps = {
    field?: string;
    label?: string;
    helperText?: string;
    tooltip?: boolean;
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

type InformedSelectFieldValue = OnChangeValue<InformedSelectOption, boolean>;

const InformedSelect = (props: InformedSelectProps) => {
    const isMulti = props.isMulti === true;
    const informedFieldConfig = {
        ...props,
        multiple: isMulti,
    } as FieldProps<InformedSelectFieldProps> & { multiple?: boolean };
    const { informed, render, fieldState, fieldApi } = useField<
        InformedSelectFieldProps,
        InformedSelectFieldValue
    >(informedFieldConfig);
    const { value } = fieldState;
    const { setValue, setTouched } = fieldApi;
    const {
        initialValue: _initialValue,
        forwardedRef,
        className,
        label,
        helperText: _helperText,
        tooltip: _tooltip,
        onBlur,
        field: _field,
        name: _name,
        ...selectProps
    } = props;

    const id = uniqid("informed-select-");

    /* Do not spread informed handlers/value onto ReactSelect */
    const {
        onChange: informedOnChange,
        onBlur: informedOnBlur,
        value: _informedValue,
        ...informedRest
    } = informed || {};

    /* react-select isMulti expects an array (use [] when empty). Single expects null when cleared. */
    const selectValue: InformedSelectFieldValue = isMulti
        ? Array.isArray(value)
            ? (value as InformedSelectOption[])
            : value == null
              ? []
              : [value as InformedSelectOption]
        : value != null && value !== ""
          ? (value as InformedSelectOption)
          : null;

    return render(
        <div className={"form-element--select"}>
            {label && <label className={"form-element__label"}>{label}</label>}
            <ReactSelect<InformedSelectOption, boolean, GroupBase<InformedSelectOption>>
                {...informedRest}
                className={clsx(className)}
                {...selectProps}
                ref={forwardedRef}
                value={selectValue}
                onChange={(selectedValue) => {
                    if (typeof informedOnChange === "function") {
                        informedOnChange(selectedValue as unknown as React.SyntheticEvent);
                    } else {
                        setValue(selectedValue, selectedValue as unknown as React.SyntheticEvent);
                    }
                }}
                onBlur={(event) => {
                    if (typeof informedOnBlur === "function") {
                        informedOnBlur(event as unknown as React.SyntheticEvent);
                    } else {
                        setTouched(true, event);
                    }
                    if (typeof onBlur === "function") {
                        onBlur(
                            {
                                value: selectValue,
                                name: props.name,
                                field: props.field,
                            },
                            event
                        );
                    }
                }}
                inputId={id}
            />
        </div>
    );
};

export default InformedSelect;
