import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import Tooltip from "./Tooltip";

describe("Tooltip", () => {
    it("renders tooltip text", () => {
        render(<Tooltip text="This is a tooltip message!" showTip />);

        expect(screen.getByText("This is a tooltip message!")).toBeInTheDocument();
    });

    it("renders an icon trigger by default", () => {
        render(<Tooltip text="Info" iconName="info-circle" showTip />);

        expect(document.querySelector(".icon--info-circle")).toBeInTheDocument();
        expect(document.querySelector(".c-tooltip__icon")).toBeInTheDocument();
    });

    it("renders wrapper children when type is wrapper", () => {
        render(
            <Tooltip type="wrapper" text="Wrapped tooltip" showTip>
                <span>Hover over me</span>
            </Tooltip>
        );

        expect(screen.getByText("Hover over me")).toBeInTheDocument();
    });

    it.each([
        ["top", "c-tooltip--top"],
        ["bottom", "c-tooltip--bottom"],
        ["left", "c-tooltip--left"],
        ["right", "c-tooltip--right"],
    ] as const)("applies position class %s", (position, expectedClass) => {
        const { container } = render(<Tooltip text="Positioned" position={position} showTip />);

        expect(container.querySelector(`.${expectedClass}`)).toBeInTheDocument();
    });

    it("shows the tooltip when showTip is true", () => {
        render(<Tooltip text="Visible tip" showTip />);

        expect(document.querySelector(".c-tooltip__text.show")).toBeInTheDocument();
    });

    it("hides the tooltip when showTip is false", () => {
        render(<Tooltip text="Hidden tip" showTip={false} />);

        expect(document.querySelector(".c-tooltip__text.show")).not.toBeInTheDocument();
    });

    it("removes the arrow class when arrow is false", () => {
        render(<Tooltip text="No arrow" arrow={false} showTip />);

        expect(document.querySelector(".c-tooltip__text--no-arrow")).toBeInTheDocument();
    });

    it("applies a custom className on the root", () => {
        const { container } = render(<Tooltip text="Custom" className="my-tooltip" showTip />);

        expect(container.querySelector(".c-tooltip.my-tooltip")).toBeInTheDocument();
    });
});
