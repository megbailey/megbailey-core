import { describe, expect, it } from "vitest";
import { noteTooltipToggle, placeTooltip, type TooltipRect } from "./placeTooltip";

const trigger: TooltipRect = {
    top: 300,
    left: 40,
    right: 56,
    bottom: 316,
    width: 16,
    height: 16,
};

describe("placeTooltip", () => {
    it("prefers the requested side when it fits", () => {
        expect(placeTooltip(trigger, { width: 80, height: 40 }, { width: 400, height: 600 }, "bottom")).toEqual({
            top: 324,
            left: 8,
        });
    });

    it("flips above when the tip would pass the bottom edge", () => {
        const placed = placeTooltip(trigger, { width: 80, height: 80 }, { width: 400, height: 360 }, "bottom");
        expect(placed.top).toBe(trigger.top - 8 - 80);
        expect(placed.top + 80).toBeLessThanOrEqual(360);
    });

    it("stays below the trigger when the host can grow", () => {
        const placed = placeTooltip(
            trigger,
            { width: 80, height: 80 },
            { width: 400, height: 360 },
            "bottom",
            undefined,
            { allowEndOverflow: true }
        );
        expect(placed.top).toBe(trigger.bottom + 8);
        expect(placed.top).toBeGreaterThan(trigger.top);
    });

    it("keeps a wide tip inside the viewport", () => {
        const placed = placeTooltip(trigger, { width: 200, height: 40 }, { width: 180, height: 600 }, "bottom");
        expect(placed.left).toBe(8);
        expect(placed.left + 200).toBeGreaterThan(180);
    });
});

describe("noteTooltipToggle", () => {
    it("latches after repeated toggles in a short window", () => {
        let times: number[] = [];
        let latch = false;
        for (const now of [0, 20, 40, 60]) {
            ({ times, latch } = noteTooltipToggle(times, now));
        }
        expect(latch).toBe(true);
    });

    it("does not latch when toggles are spaced out", () => {
        const first = noteTooltipToggle([], 0);
        const second = noteTooltipToggle(first.times, 500);
        expect(second.latch).toBe(false);
    });
});
