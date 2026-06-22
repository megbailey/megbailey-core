import { useState } from "react";
import uniqid from "uniqid";

import Button from "../button/Button";

export type ButtonSelectOption = string | { label: string; value: any };

export type ButtonSelectProps = {
    label?: string;
    options?: ButtonSelectOption[];
    theme?: string;
    initialValue?: any | any[];
    tooltip?: boolean;
    onChange?: (value: any) => void;
    isDisabled?: boolean;
    isMulti?: boolean;
    isGreedy?: boolean;
    capitalizeOptions?: boolean;
    [key: string]: any;
}

const ButtonSelect = ({
    label,
    options = [],
    theme = 'primary',
    initialValue,
    tooltip,
    onChange,
    isDisabled = false,
    isMulti = false,
    isGreedy = true,
    capitalizeOptions = true,
    ...other
}: ButtonSelectProps) => {
   
    const [selectedOptions, setSelectedOptions] = useState<any[]>(
        Array.isArray(initialValue) ? initialValue : [ initialValue ]
    );
    const id = uniqid("button-selector");

    return (
        <div className="btn-selector" {...other}>
            { label && (
                <label
                    id={id}
                    className={'form__label btn-selector__label'}
                >
                    {label}
                </label>
            )}
            <div className="btn-selector__options">
                <div className="btn-group">
                    {options.map((item, index) => {
                        let itemLabel: string;
                        let itemValue: any;
                        if ( typeof item === "object" && item !== null ) {
                            itemLabel = item.label;
                            itemValue = item.value;
                        } else {
                            const itemStr = String(item);
                            itemLabel = itemStr;
                            itemValue = item;
                        }

                        return (
                            <Button
                                key={`button-selector-${index}`}
                                theme={theme}
                                size={'small'}
                                layout={'inline'}
                                active={ selectedOptions.includes(itemValue) }
                                inverse={true}
                                text={itemLabel}
                                onClick={() => {
                                    if ( isDisabled ) return null;
                                    if ( !isMulti && !selectedOptions.includes(itemValue) ) {
                                        // greedy select
                                        setSelectedOptions([ itemValue ])
                                        typeof onChange === 'function' ? onChange(itemValue) : null
                                    } else if ( isMulti && !selectedOptions.includes(itemValue) ) {
                                        // if value isn't included, add it to state
                                        setSelectedOptions([ ...selectedOptions, itemValue ])
                                        typeof onChange === 'function' ? onChange([ ...selectedOptions, itemValue ]) : null
                                    } else if (( isMulti || !isGreedy ) && selectedOptions.includes(itemValue) ) {
                                        // if value is included in state, remove it from state
                                        const newState = selectedOptions.filter( selectedValue => selectedValue !== itemValue )
                                        setSelectedOptions(newState)
                                        typeof onChange === 'function' 
                                            ? onChange( newState.length === 0 
                                                ? null 
                                                : newState
                                            ) : null
                                    }
                                }}
                                aria-labelledby={id}
                            />
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default ButtonSelect;