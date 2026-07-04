import type { Meta, StoryObj } from "@storybook/react-vite";
import Icon from "./Icon";

const meta = {
    title: "Components/Icon",
    component: Icon,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        name: {
            control: "select",
            options: ["circle-minus", "plus-circle", "file", "info-circle", "trash-can"],
        },
        size: {
            control: "select",
            options: ["micro", "small", "normal", "large", "jumbo"],
        },
        theme: {
            control: "select",
            options: ["regular", "solid"],
        },
        color: { control: "color" },
        inverse: { control: "boolean" },
    },
    args: {
        name: "info-circle",
        size: "normal",
        theme: "regular",
    },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FileIcon: Story = {
    args: {
        name: "file",
        color: "#1890ff",
    },
};

export const LargeTrashIcon: Story = {
    args: {
        name: "trash-can",
        size: "large",
        color: "#ff4d4f",
    },
};
