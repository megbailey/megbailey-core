import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Button from "./Button";

describe("Button", () => {
    it("renders button text", () => {
        render(<Button text="Click Me" />);

        expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
    });

    it("renders as a link when href is provided", () => {
        render(<Button text="Go" href="https://example.com" target="_blank" />);

        const link = screen.getByRole("link", { name: "Go" });
        expect(link).toHaveAttribute("href", "https://example.com");
        expect(link).toHaveAttribute("target", "_blank");
    });

    it.each([
        ["primary", "btn--primary"],
        ["secondary", "btn--secondary"],
        ["danger", "btn--danger"],
        ["success", "btn--success"],
    ] as const)("applies theme class %s", (theme, expectedClass) => {
        render(<Button text="Themed" theme={theme} />);

        expect(screen.getByRole("button")).toHaveClass(expectedClass);
    });

    it.each([
        ["small", "btn--small"],
        ["medium", "btn--medium"],
        ["large", "btn--large"],
    ] as const)("applies size class %s", (size, expectedClass) => {
        render(<Button text="Sized" size={size} />);

        expect(screen.getByRole("button")).toHaveClass(expectedClass);
    });

    it("applies layout class", () => {
        render(<Button text="Block" layout="block" />);

        expect(screen.getByRole("button")).toHaveClass("btn--block");
    });

    it("applies active class when active is true", () => {
        render(<Button text="Active" active />);

        expect(screen.getByRole("button")).toHaveClass("btn--active");
    });

    it("does not apply active class by default", () => {
        render(<Button text="Default" />);

        expect(screen.getByRole("button")).not.toHaveClass("btn--active");
    });

    it("applies a custom className", () => {
        render(<Button text="Custom" className="my-button" />);

        expect(screen.getByRole("button")).toHaveClass("my-button");
    });

    it("renders an icon when icon prop is provided", () => {
        render(<Button text="Delete" icon={{ name: "trash-can" }} />);

        expect(document.querySelector(".icon--trash-can")).toBeInTheDocument();
    });

    it("renders children", () => {
        render(
            <Button>
                <span data-testid="child">Child content</span>
            </Button>
        );

        expect(screen.getByTestId("child")).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(<Button text="Click" onClick={onClick} />);

        await user.click(screen.getByRole("button"));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("forwards aria attributes to the button", () => {
        render(<Button text="Expand" aria-expanded={true} aria-controls="panel-1" />);

        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-expanded", "true");
        expect(button).toHaveAttribute("aria-controls", "panel-1");
    });

    it("forwards a custom role to the button", () => {
        render(<Button text="Menu" role="menuitem" />);

        expect(screen.getByRole("menuitem", { name: "Menu" })).toBeInTheDocument();
    });
});
