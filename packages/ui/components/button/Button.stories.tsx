import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Button from "./Button";

const meta = {
    title: "Components/Button",
    component: Button,
    //tags: ['autodocs'],
    argTypes: {
        theme: {
            control: "select",
            options: ["primary", "secondary", "danger", "success"],
        },
        size: {
            control: "select",
            options: ["micro", "small", "normal", "large", "jumbo"],
        },
        layout: {
            control: "select",
            options: ["inline", "block"],
        },
        active: { control: "boolean" },
        inverse: { control: "boolean" },
        text: { control: "text" },
        href: { control: "text" },
        target: {
            control: "select",
            options: ["_self", "_blank", "_parent"],
        },
    },
    args: {
        text: "Click Me",
        theme: "primary",
        size: "normal",
        layout: "inline",
        active: false,
        inverse: false,
        target: "_blank",
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
