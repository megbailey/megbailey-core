import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import ButtonSelect from "./ButtonSelect";

const meta = {
    title: "Components/Form Elements/ButtonSelect",
    component: ButtonSelect,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        label: { control: "text" },
        theme: {
            control: "select",
            options: ["primary", "secondary", "danger", "success"],
        },
        isDisabled: { control: "boolean" },
        isMulti: { control: "boolean" },
        capitalizeOptions: { control: "boolean" },
    },
    args: {
        label: "Select Size",
        options: ["small", "medium", "large", "extra-large"],
        theme: "primary",
        isDisabled: false,
        isMulti: false,
        capitalizeOptions: true,
        onChange: fn(),
    },
} satisfies Meta<typeof ButtonSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultiSelect: Story = {
    args: {
        label: "Select Multiple",
        options: [
            { label: "Red", value: "red" },
            { label: "Blue", value: "blue" },
            { label: "Green", value: "green" },
        ],
        isMulti: true,
        initialValue: ["red", "green"],
    },
};
