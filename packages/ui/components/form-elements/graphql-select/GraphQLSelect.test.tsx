import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import GraphQLSelect, { parseJSONOptionValue } from "./GraphQLSelect";
import { renderWithForm } from "../../../utils/test-utils";

describe("GraphQLSelect", () => {
    describe("parseJSONOptionValue", () => {
        it("parses a single selected option", () => {
            const item = { id: "1", label: "Option A" };
            const value = parseJSONOptionValue({
                value: { label: "Option A", value: JSON.stringify(item) },
            });

            expect(value).toEqual(item);
        });

        it("parses multiple selected options", () => {
            const items = [
                { id: "1", label: "Option A" },
                { id: "2", label: "Option B" },
            ];

            const value = parseJSONOptionValue({
                value: items.map((item) => ({
                    label: item.label,
                    value: JSON.stringify(item),
                })),
            });

            expect(value).toEqual(items);
        });

        it("returns an empty array when no value is selected", () => {
            expect(parseJSONOptionValue({ value: null })).toEqual([]);
        });
    });

    describe("component", () => {
        it("renders the label and combobox after data resolves", () => {
            const { container } = renderWithForm(
                <GraphQLSelect
                    field="graphqlSelect"
                    label="GraphQL Source Select"
                    endpointDataPath="items"
                />
            );

            expect(screen.getByText("GraphQL Source Select")).toBeInTheDocument();
            expect(container.querySelector('[role="combobox"]')).toBeInTheDocument();
        });

        it("renders the placeholder when provided", () => {
            renderWithForm(
                <GraphQLSelect
                    field="graphqlSelect"
                    label="GraphQL Source Select"
                    endpointDataPath="items"
                    placeholder="Pick an item"
                />
            );

            expect(screen.getByText("Pick an item")).toBeInTheDocument();
        });

        it("disables the combobox when isDisabled is true", () => {
            const { container } = renderWithForm(
                <GraphQLSelect
                    field="graphqlSelect"
                    label="GraphQL Source Select"
                    endpointDataPath="items"
                    isDisabled
                />
            );

            expect(container.querySelector('[aria-disabled="true"]')).toBeInTheDocument();
        });

        it("renders multiple selected values when isMulti is true", () => {
            renderWithForm(
                <GraphQLSelect
                    field="graphqlSelect"
                    label="GraphQL Source Select"
                    endpointDataPath="items"
                    isMulti
                    initialValue={[
                        { id: "1", label: "Option A", name: "Option A" },
                        { id: "2", label: "Option B", name: "Option B" },
                    ]}
                />
            );

            expect(screen.getByText("Option A")).toBeInTheDocument();
            expect(screen.getByText("Option B")).toBeInTheDocument();
        });

        it("uses formatOptionLabel for the displayed option label", () => {
            renderWithForm(
                <GraphQLSelect
                    field="graphqlSelect"
                    label="GraphQL Source Select"
                    endpointDataPath="items"
                    initialValue={[{ id: "1", label: "Option A", name: "Option A" }]}
                    formatOptionLabel={(item) => `Custom ${item.name}`}
                />
            );

            expect(screen.getByText("Custom Option A")).toBeInTheDocument();
        });
    });
});
