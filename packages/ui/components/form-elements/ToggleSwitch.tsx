import { useState } from 'react';
import Tooltip from '../tooltip/Tooltip';

export const propValues = {
    initalValue: [true, false],
};

export type ToggleSwitchProps = {
    label?: string;
    helperText?: string;
    initialValue?: boolean;
    tooltip?: boolean;
    onLabel?: string;
    offLabel?: string;
    onClick?: (event: any) => void;
    [key: string]: any;
}

const ToggleSwitch = ( props: ToggleSwitchProps ) => {
   const {
        label,
        helperText,
        initialValue = false,
        tooltip = false,
        onLabel = "Yes",
        offLabel = "No",
        onClick,
        ...other
   } = props
    const [ switchState, setSwitchState ] = useState(initialValue)

    return (
        <div className='form-element c-form-element--inline' {...other}>
            {label && (
                <span 
                    className="form-element__label" 
                >
                    <div dangerouslySetInnerHTML={{ __html: label }} ></div>
                    {(tooltip && helperText) && <Tooltip position="right" text={helperText}/>}
                </span>
            )}
            <div 
                role="switch" 
                className='c-switch' aria-checked={switchState} tabIndex={0}
                onClick={e => {
                    if ( typeof onClick === 'function' ) {
                        const customEvent = { ...e, value: !switchState } as any;
                        onClick(customEvent)
                    }
                    setSwitchState(!switchState)
                }}
            >
                <span className="switch">
                    <span className="c-switch__circle"></span>
                    <span className="c-switch--on" aria-hidden="true">{onLabel}</span>
                    <span className="c-switch--off" aria-hidden="true">{offLabel}</span>
                </span>
            </div>
        </div>
    );
};

export default ToggleSwitch;