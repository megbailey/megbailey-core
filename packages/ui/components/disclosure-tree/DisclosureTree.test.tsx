import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import DisclosureTree from "./DisclosureTree";
import type { DisclosureTreeItemProps } from "./types";

const mockItems: DisclosureTreeItemProps[] = [
    {
        id: "1",
        parent_id: null,
        item: <p>Item 1</p>,
        items: [
            {
                id: "1a",
                parent_id: "1",
                item: <p>Item 1a</p>,
            },
        ],
    },
    {
        id: "2",
        parent_id: null,
        item: <p>Item 2</p>,
        items: [
            {
                id: "2a",
                parent_id: "2",
                item: <p>Item 2a</p>,
            },
        ],
    },
];

describe("DisclosureTree", () => {
    it("renders top-level items with the expected tree id", () => {
        render(<DisclosureTree id="story-tree" items={mockItems} />);

        expect(document.getElementById("disclosure-tree-story-tree")).toBeInTheDocument();
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
    });

    it("does not render items when collapseOnLoad is true", () => {
        render(
            <DisclosureTree
                id="collapsed-tree"
                items={mockItems}
                collapseOnLoad
            />
        );

        expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Item 2")).not.toBeInTheDocument();
    });

    it("renders nested children after expanding a branch", async () => {
        const user = userEvent.setup();

        render(<DisclosureTree id="expand-tree" items={mockItems} nested />);

        expect(screen.queryByText("Item 1a")).not.toBeInTheDocument();

        const expandButtons = screen.getAllByRole("button");
        await user.click(expandButtons[0]);

        expect(screen.getByText("Item 1a")).toBeInTheDocument();
    });

    it("renders branch items flat when nested is false", () => {
        render(<DisclosureTree id="flat-tree" items={mockItems} nested={false} />);

        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("shows pre-expanded branches", () => {
        render(
            <DisclosureTree
                id="pre-expanded-tree"
                items={mockItems}
                preExpandedIds={["1"]}
            />
        );

        expect(screen.getByText("Item 1a")).toBeInTheDocument();
    });

    it("calls onKeyEscape when provided and escape is pressed", async () => {
        const user = userEvent.setup();
        const onKeyEscape = vi.fn();

        render(
            <DisclosureTree
                id="escape-tree"
                items={mockItems}
                onKeyEscape={onKeyEscape}
            />
        );

        const firstLeaf = screen.getByText("Item 1").closest("[tabindex='0']");
        expect(firstLeaf).toBeTruthy();
        firstLeaf?.focus();
        await user.keyboard("{Escape}");

        expect(onKeyEscape).toHaveBeenCalled();
    });

    it("allows only one expanded branch when allowMultipleExpanded is false", async () => {
        const user = userEvent.setup();

        render(
            <DisclosureTree
                id="single-expand-tree"
                items={mockItems}
                allowMultipleExpanded={false}
            />
        );

        const expandButtons = screen.getAllByRole("button");
        await user.click(expandButtons[0]);
        expect(screen.getByText("Item 1a")).toBeInTheDocument();

        await user.click(expandButtons[1]);
        expect(screen.queryByText("Item 1a")).not.toBeInTheDocument();
        expect(screen.getByText("Item 2a")).toBeInTheDocument();
    });

    it("collapses expanded branches when collapseOnBlur is true and clicking outside", async () => {
        render(
            <DisclosureTree
                id="blur-tree"
                items={mockItems}
                preExpandedIds={["1"]}
                collapseOnBlur
            />
        );

        expect(screen.getByText("Item 1a")).toBeInTheDocument();

        fireEvent.mouseDown(document.body);

        expect(screen.queryByText("Item 1a")).not.toBeInTheDocument();
    });
});
