import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ToggleSwitch from "./ToggleSwitch";

describe("ToggleSwitch", () => {
    it("renders the label", () => {
        render(<ToggleSwitch label="Enable Notifications" />);

        expect(screen.getByText("Enable Notifications")).toBeInTheDocument();
    });

    it("renders helper text below the switch", () => {
        render(
            <ToggleSwitch helperText="Send me sound notifications for updates" />
        );

        expect(
            screen.getByText("Send me sound notifications for updates")
        ).toBeInTheDocument();
    });

    it("renders unchecked by default", () => {
        render(<ToggleSwitch />);

        expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "false");
    });

    it("respects initialValue", () => {
        render(<ToggleSwitch initialValue={true} />);

        expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
        expect(screen.getByText("On")).toHaveClass("toggle-switch__sr-only");
    });

    it("uses custom onLabel and offLabel in screen-reader text", () => {
        render(
            <ToggleSwitch
                initialValue={true}
                onLabel="Enabled"
                offLabel="Disabled"
            />
        );

        expect(screen.getByText("Enabled")).toBeInTheDocument();
    });

    it("uses offLabel as aria-label when no label is provided", () => {
        render(<ToggleSwitch offLabel="Disabled" />);

        expect(screen.getByRole("switch", { name: "Disabled" })).toBeInTheDocument();
    });

    it("applies the on track class when checked", () => {
        render(<ToggleSwitch initialValue={true} />);

        expect(screen.getByRole("switch")).toHaveClass("toggle-switch__track--on");
    });

    it("applies a custom className on the root", () => {
        const { container } = render(<ToggleSwitch className="my-toggle" />);

        expect(container.querySelector(".toggle-switch.my-toggle")).toBeInTheDocument();
    });

    it("toggles state and calls onClick with the next value", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(<ToggleSwitch onClick={onClick} />);

        const toggle = screen.getByRole("switch");
        await user.click(toggle);

        expect(toggle).toHaveAttribute("aria-checked", "true");
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onClick.mock.calls[0][0].value).toBe(true);
    });
});
