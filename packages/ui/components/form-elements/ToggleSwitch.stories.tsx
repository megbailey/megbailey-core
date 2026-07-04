import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import ToggleSwitch from "./ToggleSwitch";

const meta = {
    title: "Components/Form Elements/ToggleSwitch",
    component: ToggleSwitch,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        label: { control: "text" },
        helperText: { control: "text" },
        initialValue: { control: "boolean" },
        tooltip: { control: "boolean" },
        onLabel: { control: "text" },
        offLabel: { control: "text" },
    },
    args: {
        label: "Enable Notifications",
        helperText: "Send me sound notifications for updates",
        initialValue: false,
        tooltip: true,
        onLabel: "Yes",
        offLabel: "No",
        onClick: fn(),
    },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithoutTooltip: Story = {
    args: {
        tooltip: false,
    },
};

export const CustomLabels: Story = {
    args: {
        onLabel: "ON",
        offLabel: "OFF",
    },
};
