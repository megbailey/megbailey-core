import { describe, expect, it, vi } from "vitest";

import { isCallableFunction } from "./types";

describe("form-elements/types", () => {
    describe("isCallableFunction", () => {
        it("returns true for functions", () => {
            expect(isCallableFunction(() => undefined)).toBe(true);
        });

        it("returns false for non-functions and warns", () => {
            const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);

            expect(isCallableFunction(null, "testFn")).toBe(false);
            expect(warnSpy).toHaveBeenCalledWith("testFn prop is not a callable function.");

            warnSpy.mockRestore();
        });
    });
});
