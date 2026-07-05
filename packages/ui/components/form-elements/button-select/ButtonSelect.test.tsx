import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ButtonSelect from "./ButtonSelect";

describe("ButtonSelect", () => {
    it("renders the label and option buttons", () => {
        render(
            <ButtonSelect
                label="Select Size"
                options={["small", "medium", "large", "extra-large"]}
            />
        );

        expect(screen.getByText("Select Size")).toBeInTheDocument();
        expect(screen.getByText("small")).toBeInTheDocument();
        expect(screen.getByText("medium")).toBeInTheDocument();
        expect(screen.getByText("large")).toBeInTheDocument();
        expect(screen.getByText("extra-large")).toBeInTheDocument();
    });

    it("renders object options using their labels", () => {
        render(
            <ButtonSelect
                options={[
                    { label: "Red", value: "red" },
                    { label: "Blue", value: "blue" },
                ]}
            />
        );

        expect(screen.getByText("Red")).toBeInTheDocument();
        expect(screen.getByText("Blue")).toBeInTheDocument();
    });

    it.each([
        ["primary", "btn--primary"],
        ["secondary", "btn--secondary"],
        ["danger", "btn--danger"],
        ["success", "btn--success"],
    ] as const)("applies theme %s to option buttons", (theme, expectedClass) => {
        render(
            <ButtonSelect
                options={["small"]}
                theme={theme}
            />
        );

        expect(screen.getByRole("button")).toHaveClass(expectedClass);
    });

    it("marks initialValue options as active in single-select mode", () => {
        render(
            <ButtonSelect
                options={["small", "medium", "large"]}
                initialValue="medium"
            />
        );

        expect(screen.getByText("medium").closest("button")).toHaveClass("btn--active");
        expect(screen.getByText("small").closest("button")).not.toHaveClass("btn--active");
    });

    it("marks multiple initial values as active in multi-select mode", () => {
        render(
            <ButtonSelect
                isMulti
                options={[
                    { label: "Red", value: "red" },
                    { label: "Blue", value: "blue" },
                    { label: "Green", value: "green" },
                ]}
                initialValue={["red", "green"]}
            />
        );

        expect(screen.getByText("Red").closest("button")).toHaveClass("btn--active");
        expect(screen.getByText("Green").closest("button")).toHaveClass("btn--active");
        expect(screen.getByText("Blue").closest("button")).not.toHaveClass("btn--active");
    });

    it("calls onChange with the selected value in single-select mode", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <ButtonSelect
                options={[
                    { label: "Red", value: "red" },
                    { label: "Blue", value: "blue" },
                ]}
                onChange={onChange}
            />
        );

        await user.click(screen.getByText("Blue"));

        expect(onChange).toHaveBeenCalledWith("blue");
    });

    it("supports multi-select toggling", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <ButtonSelect
                isMulti
                options={[
                    { label: "Red", value: "red" },
                    { label: "Blue", value: "blue" },
                ]}
                initialValue={["red"]}
                onChange={onChange}
            />
        );

        await user.click(screen.getByText("Blue"));
        expect(onChange).toHaveBeenCalledWith(["red", "blue"]);

        await user.click(screen.getByText("Red"));
        expect(onChange).toHaveBeenLastCalledWith(["blue"]);
    });

    it("does not call onChange when disabled", async () => {
        const user = userEvent.setup();
        const onChange = vi.fn();

        render(
            <ButtonSelect
                isDisabled
                options={["small", "medium"]}
                onChange={onChange}
            />
        );

        await user.click(screen.getByText("medium"));

        expect(onChange).not.toHaveBeenCalled();
    });

    it("applies a custom className on the root", () => {
        const { container } = render(
            <ButtonSelect
                className="my-button-select"
                options={["small"]}
            />
        );

        expect(container.querySelector(".my-button-select")).toBeInTheDocument();
    });
});
