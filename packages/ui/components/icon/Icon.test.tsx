import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";

import Icon from "./Icon";

describe("Icon", () => {
    it("renders a known icon with the expected class", () => {
        const { container } = render(<Icon name="info-circle" />);

        expect(container.querySelector(".icon--info-circle")).toBeInTheDocument();
    });

    it.each([
        ["micro", "12px"],
        ["small", "16px"],
        ["normal", "24px"],
        ["large", "32px"],
        ["jumbo", "48px"],
    ] as const)("applies size %s as inline dimensions", (size, dimension) => {
        const { container } = render(<Icon name="file" size={size} />);
        const icon = container.querySelector(".icon") as HTMLElement;

        expect(icon.style.width).toBe(dimension);
        expect(icon.style.height).toBe(dimension);
    });

    it("applies a custom color", () => {
        const { container } = render(<Icon name="file" color="#1890ff" />);
        const icon = container.querySelector(".icon") as HTMLElement;

        expect(icon.style.color).toBe("rgb(24, 144, 255)");
    });

    it("applies a custom className", () => {
        const { container } = render(<Icon name="file" className="custom-icon" />);

        expect(container.querySelector(".icon.custom-icon")).toBeInTheDocument();
    });

    it("throws when the icon name is unknown", () => {
        expect(() => render(<Icon name="unknown-icon" />)).toThrow(/Icon "unknown-icon" not found/);
    });
});
