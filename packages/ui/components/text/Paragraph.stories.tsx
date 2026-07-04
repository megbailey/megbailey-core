import type { Meta, StoryObj } from "@storybook/react-vite";
import Paragraph from "./Paragraph";

const meta = {
    title: "Components/Paragraph",
    component: Paragraph,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    argTypes: {
        text: { control: "text" },
        className: { control: "text" },
    },
    args: {
        text: "This is a paragraph of text rendered by the Paragraph component.",
    },
} satisfies Meta<typeof Paragraph>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomClassName: Story = {
    args: {
        text: "Styled paragraph with a custom class name.",
        className: "custom-paragraph-class",
    },
};
