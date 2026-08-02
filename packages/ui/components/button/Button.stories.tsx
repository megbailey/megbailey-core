import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Button, { type ButtonSize, type ButtonTheme } from "./Button";
import "./Button.css";

const meta = {
    title: "Components/Button",
    component: Button,
    parameters: {
        layout: "centered",
    },
    argTypes: {
        theme: {
            control: "select",
            options: ["primary", "secondary", "danger", "success"],
        },
        size: {
            control: "select",
            options: ["small", "medium", "large"],
        },
        layout: {
            control: "select",
            options: ["inline", "block"],
        },
        active: { control: "boolean" },
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
        size: "medium",
        layout: "inline",
        active: false,
        onClick: fn(() => console.log("button clicked!")),
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const sizeOptions: ButtonSize[] = ["small", "medium", "large"];
const themeOptions: ButtonTheme[] = ["primary", "secondary", "danger", "success"];

export const Sizes: Story = {
    render: (args) => (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            {sizeOptions.map((size) => (
                <Button
                    key={size}
                    {...args}
                    size={size}
                    text={`${args.text} (${size})`}
                    active={args.size === size ? args.active : false}
                />
            ))}
        </div>
    ),
};

export const ActiveState: Story = {
    args: {
        text: "Button",
        theme: "primary",
        size: "medium",
    },
    render: (args) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Button {...args} active={false} text={`${args.text} (default)`} />
                <Button {...args} active text={`${args.text} (active)`} />
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Button {...args} active={false} text={`${args.text} (default)`} />
                <Button {...args} active text={`${args.text} (active)`} />
            </div>
        </div>
    ),
};

export const Themes: Story = {
    render: (args) => (
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {themeOptions.map((theme) => (
                <Button
                    key={theme}
                    {...args}
                    theme={theme}
                    text={theme.charAt(0).toUpperCase() + theme.slice(1)}
                    active={args.theme === theme ? args.active : false}
                />
            ))}
        </div>
    ),
};

export const BlockLayout: Story = {
    args: {
        text: "Full Width Button",
        layout: "block",
        size: "large",
    },
    decorators: [
        (Story) => (
            <div style={{ width: "320px" }}>
                <Story />
            </div>
        ),
    ],
};
