import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import Paragraph from "./Paragraph";

describe("Paragraph", () => {
    it("renders text prop content", () => {
        render(
            <Paragraph text="This is a paragraph of text rendered by the Paragraph component." />
        );

        expect(
            screen.getByText(
                "This is a paragraph of text rendered by the Paragraph component."
            )
        ).toBeInTheDocument();
    });

    it("renders children when text is not provided", () => {
        render(
            <Paragraph>
                <span>Child paragraph content</span>
            </Paragraph>
        );

        expect(screen.getByText("Child paragraph content")).toBeInTheDocument();
    });

    it("applies a custom className", () => {
        render(
            <Paragraph
                text="Styled paragraph with a custom class name."
                className="custom-paragraph-class"
            />
        );

        const paragraph = screen.getByText("Styled paragraph with a custom class name.");
        expect(paragraph).toHaveClass("custom-paragraph-class");
    });
});
