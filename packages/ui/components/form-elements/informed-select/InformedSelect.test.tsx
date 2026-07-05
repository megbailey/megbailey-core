import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import InformedSelect from "./InformedSelect";
import { renderWithForm } from "../../../utils/test-utils";

const options = [
    { label: "Option 1", value: "opt1" },
    { label: "Option 2", value: "opt2" },
    { label: "Option 3", value: "opt3" },
];

describe("InformedSelect", () => {
    it("renders the label", () => {
        renderWithForm(
            <InformedSelect
                field="mySelect"
                label="Select Option"
                options={options}
            />
        );

        expect(screen.getByText("Select Option")).toBeInTheDocument();
    });

    it("renders the placeholder", () => {
        renderWithForm(
            <InformedSelect
                field="mySelect"
                label="Select Option"
                placeholder="Choose..."
                options={options}
            />
        );

        expect(screen.getByText("Choose...")).toBeInTheDocument();
    });

    it("renders a combobox", () => {
        renderWithForm(
            <InformedSelect
                field="mySelect"
                options={options}
            />
        );

        expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("disables the combobox when isDisabled is true", () => {
        const { container } = renderWithForm(
            <InformedSelect
                field="mySelect"
                options={options}
                isDisabled
            />
        );

        expect(container.querySelector('[aria-disabled="true"]')).toBeInTheDocument();
    });

    it("wraps the control in the select form element class", () => {
        const { container } = renderWithForm(
            <InformedSelect
                field="mySelect"
                options={options}
            />
        );

        expect(container.querySelector(".form-element--select")).toBeInTheDocument();
    });

    it("renders selected values in multi-select mode", () => {
        renderWithForm(
            <InformedSelect
                field="mySelect"
                isMulti
                options={options}
                initialValue={[
                    { label: "Option 1", value: "opt1" },
                    { label: "Option 2", value: "opt2" },
                ]}
            />
        );

        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("applies a custom className to the select control", () => {
        const { container } = renderWithForm(
            <InformedSelect
                field="mySelect"
                options={options}
                className="my-informed-select"
            />
        );

        expect(container.querySelector(".my-informed-select")).toBeInTheDocument();
    });
});
