export type TooltipRect = {
    top: number;
    left: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
};

export type TooltipSize = {
    width: number;
    height: number;
};

const MARGIN = 8;

function fits(top: number, left: number, tip: TooltipSize, viewport: TooltipSize, margin: number): boolean {
    return (
        top >= margin &&
        left >= margin &&
        top + tip.height <= viewport.height - margin &&
        left + tip.width <= viewport.width - margin
    );
}

export type PlaceTooltipOptions = {
    /** Keep the requested side and let the host grow, instead of flipping the tip upward. */
    allowEndOverflow?: boolean;
};

/** Place a tooltip. By default it stays inside the viewport. */
export function placeTooltip(
    trigger: TooltipRect,
    tip: TooltipSize,
    viewport: TooltipSize,
    position = "top",
    margin = MARGIN,
    options: PlaceTooltipOptions = {}
): { top: number; left: number } {
    const centerLeft = trigger.left + trigger.width / 2 - tip.width / 2;
    const centerTop = trigger.top + trigger.height / 2 - tip.height / 2;
    const below = { top: trigger.bottom + margin, left: centerLeft };
    const above = { top: trigger.top - margin - tip.height, left: centerLeft };
    const toRight = { top: centerTop, left: trigger.right + margin };
    const toLeft = { top: centerTop, left: trigger.left - margin - tip.width };
    const preferred =
        position === "bottom" ? below : position === "left" ? toLeft : position === "right" ? toRight : above;

    if (options.allowEndOverflow) {
        return {
            top: Math.max(preferred.top, margin),
            left: Math.max(preferred.left, margin),
        };
    }

    const chosen =
        [preferred, below, above, toRight, toLeft].find((spot) =>
            fits(spot.top, spot.left, tip, viewport, margin)
        ) ?? preferred;

    return {
        top: Math.min(Math.max(chosen.top, margin), Math.max(margin, viewport.height - tip.height - margin)),
        left: Math.min(Math.max(chosen.left, margin), Math.max(margin, viewport.width - tip.width - margin)),
    };
}

/** Latch closed when show/hide repeats fast enough to strobe. */
export function noteTooltipToggle(
    previous: number[],
    now: number,
    windowMs = 300,
    limit = 4
): { times: number[]; latch: boolean } {
    const times = [...previous.filter((time) => now - time < windowMs), now];
    return { times, latch: times.length >= limit };
}
