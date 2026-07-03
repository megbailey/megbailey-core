import React from 'react';
import { useField } from 'informed';
import ReactSelect from 'react-select';
import clsx from 'clsx';
import uniqid from 'uniqid';

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectProps {
    field?: string;
    label?: string;
    options: SelectOption[];
    initialValue?: SelectOption | SelectOption[];
    onChange?: (value: any) => void;
    placeholder?: string;
    isMulti?: boolean;
    isDisabled?: boolean;
    formatGroupLabel?: (group: any) => React.ReactNode;
    [key: string]: any;
}

const Select = (props: SelectProps) => {
    const isMulti = props.isMulti === true;
    const informedFieldConfig = { ...props, multiple: isMulti } as any;
    const { informed, render, fieldState, fieldApi } = useField(informedFieldConfig);
    const { value } = fieldState;
    const { setValue, setTouched } = fieldApi;
    const { initialValue, forwardedRef, className, label, helperText, tooltip, ...rest } = props;


    const id = uniqid("informed-select-");

    /* Do not spread informed handlers/value onto ReactSelect */
    const {
        onChange: informedOnChange,
        onBlur: informedOnBlur,
        value: _informedValue,
        ...informedRest
    } = informed || {};

    /* react-select isMulti expects an array (use [] when empty). Single expects null when cleared. */
    const selectValue = isMulti
        ? (Array.isArray(value) ? value : value == null ? [] : [value])
        : (value != null && value !== "" ? value : null);

    return render(
        <div className={"form-element--select"}>
            {label && <label className={"form-element__label"}>{label}</label>}
            <ReactSelect
                {...informedRest}
                //id={id}
                className={clsx( className )}
                {...rest}
                ref={forwardedRef}
                value={selectValue}
                onChange={(e: any) => {
                    if (typeof informedOnChange === "function") {
                        informedOnChange(e);
                    } else {
                        setValue(e, e);
                    }
                    /* if (typeof props.onChange === "function") {
                        props.onChange(
                            {
                                value: e,
                                name: rest.name,
                                field: rest.field,
                            },
                            e
                        );
                    } */
                }}
                onBlur={(e: any) => {
                    if (typeof informedOnBlur === "function") {
                        informedOnBlur(e);
                    } else {
                        setTouched(true, e);
                    }
                   /*  if (typeof onBlur === "function") {
                        onBlur(
                            {
                                value: e,
                                name: rest.name,
                                field: rest.field,
                            },
                            e
                        ); 
                    } */
                    
                }}
                inputId={id}
            />
        </div>
    );
};

export default Select;
