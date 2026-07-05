import React from "react";
import { useField, type FieldProps } from "informed";
import ReactSelect, { type GroupBase, type SelectInstance } from "react-select";
import clsx from "clsx";
import uniqid from "uniqid";

import type {
    InformedSelectFieldProps,
    InformedSelectFieldValue,
    InformedSelectOption,
    InformedSelectProps,
} from "./types";

export type {
    InformedSelectFieldProps,
    InformedSelectFieldValue,
    InformedSelectOption,
    InformedSelectProps,
} from "./types";

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
