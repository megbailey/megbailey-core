import React, { forwardRef } from "react";
import Button from "../button/Button";
import Icon from "../icon/Icon";

import type { ExpansionControlsProps } from "./types";

const ExpansionControls = forwardRef<any, ExpansionControlsProps>(
    ({ controlsId, expanded: initialExpandedState, onClick, onKeyDown }, ref) => {
        const [expanded, setExpanded] = React.useState(initialExpandedState);

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            setExpanded(!expanded);
            onClick();
        };

        return (
            <Button
                className="controls-btn"
                ref={ref}
                role="button"
                aria-expanded={expanded}
                aria-controls={controlsId}
                onClick={handleClick}
                onKeyDown={onKeyDown}
            >
                <Icon name={expanded ? "minus-circle" : "plus-circle"} />
            </Button>
        );
    }
);

export default ExpansionControls;
