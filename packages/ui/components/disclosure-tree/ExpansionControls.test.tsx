import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ExpansionControls from "./ExpansionControls";

describe("ExpansionControls", () => {
    it("renders collapsed controls with plus icon", () => {
        render(<ExpansionControls controlsId="tree--group-1" expanded={false} onClick={vi.fn()} />);

        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-expanded", "false");
        expect(button).toHaveAttribute("aria-controls", "tree--group-1");
        expect(document.querySelector(".icon--plus-circle")).toBeInTheDocument();
    });

    it("renders expanded controls with minus icon", () => {
        render(<ExpansionControls controlsId="tree--group-1" expanded={true} onClick={vi.fn()} />);

        expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
        expect(document.querySelector(".icon--minus-circle")).toBeInTheDocument();
    });

    it("calls onClick when clicked", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();

        render(<ExpansionControls controlsId="tree--group-1" expanded={false} onClick={onClick} />);

        await user.click(screen.getByRole("button"));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("toggles aria-expanded after click", async () => {
        const user = userEvent.setup();

        render(<ExpansionControls controlsId="tree--group-1" expanded={false} onClick={vi.fn()} />);

        const button = screen.getByRole("button");
        await user.click(button);

        expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("calls onKeyDown when a key is pressed", async () => {
        const user = userEvent.setup();
        const onKeyDown = vi.fn();

        render(
            <ExpansionControls
                controlsId="tree--group-1"
                expanded={false}
                onClick={vi.fn()}
                onKeyDown={onKeyDown}
            />
        );

        await user.tab();
        await user.keyboard("{ArrowRight}");

        expect(onKeyDown).toHaveBeenCalled();
    });
});
