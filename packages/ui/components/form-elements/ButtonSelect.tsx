import { useState, type HTMLAttributes } from "react";
import uniqid from "uniqid";

import Button from "../button/Button";

export type ButtonSelectOptionValue = string | number | boolean;

export type ButtonSelectOption =
    ButtonSelectOptionValue | { label: string; value: ButtonSelectOptionValue };

export type ButtonSelectTheme = "primary" | "secondary" | "danger" | "success";

export type ButtonSelectProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> & {
    label?: string;
    options?: ButtonSelectOption[];
    theme?: ButtonSelectTheme | string;
    initialValue?: ButtonSelectOptionValue | ButtonSelectOptionValue[] | null;
    tooltip?: boolean;
    onChange?: (value: ButtonSelectOptionValue | ButtonSelectOptionValue[] | null) => void;
    isDisabled?: boolean;
    isMulti?: boolean;
    isGreedy?: boolean;
    capitalizeOptions?: boolean;
};

function getOptionParts(item: ButtonSelectOption): {
    label: string;
    value: ButtonSelectOptionValue;
} {
    if (typeof item === "object" && item !== null) {
        return {
            label: item.label,
            value: item.value,
        };
    }

    const itemStr = String(item);
    return {
        label: itemStr,
        value: item,
    };
}

const ButtonSelect = ({
    label,
    options = [],
    theme = "primary",
    initialValue,
    tooltip: _tooltip,
    onChange,
    isDisabled = false,
    isMulti = false,
    isGreedy = true,
    capitalizeOptions: _capitalizeOptions = true,
    ...other
}: ButtonSelectProps) => {
    const [selectedOptions, setSelectedOptions] = useState<ButtonSelectOptionValue[]>(
        Array.isArray(initialValue) ? initialValue : [initialValue as ButtonSelectOptionValue]
    );
    const id = uniqid("button-selector");

    return (
        <div className="btn-selector" {...other}>
            {label && (
                <label id={id} className={"form__label btn-selector__label"}>
                    {label}
                </label>
            )}
            <div className="btn-selector__options">
                <div className="btn-group">
                    {options.map((item, index) => {
                        const { label: itemLabel, value: itemValue } = getOptionParts(item);

                        return (
                            <Button
                                key={`button-selector-${index}`}
                                theme={theme}
                                size={"small"}
                                layout={"inline"}
                                active={selectedOptions.includes(itemValue)}
                                inverse={true}
                                text={itemLabel}
                                onClick={() => {
                                    if (isDisabled) return null;
                                    if (!isMulti && !selectedOptions.includes(itemValue)) {
                                        setSelectedOptions([itemValue]);
                                        if (typeof onChange === "function") onChange(itemValue);
                                    } else if (isMulti && !selectedOptions.includes(itemValue)) {
                                        const nextState = [...selectedOptions, itemValue];
                                        setSelectedOptions(nextState);
                                        if (typeof onChange === "function") onChange(nextState);
                                    } else if (
                                        (isMulti || !isGreedy) &&
                                        selectedOptions.includes(itemValue)
                                    ) {
                                        const newState = selectedOptions.filter(
                                            (selectedValue) => selectedValue !== itemValue
                                        );
                                        setSelectedOptions(newState);
                                        if (typeof onChange === "function") {
                                            onChange(newState.length === 0 ? null : newState);
                                        }
                                    }
                                }}
                                aria-labelledby={id}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ButtonSelect;
