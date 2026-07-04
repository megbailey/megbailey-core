import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "informed";
import InformedSelect, { type InformedSelectProps } from "./InformedSelect";

const meta: Meta<InformedSelectProps> = {
    title: "Components/Form Elements/InformedSelect",
    component: InformedSelect,
    decorators: [
        (Story) => (
            <Form>
                <div style={{ width: "300px" }}>
                    <Story />
                </div>
            </Form>
        ),
    ],
    tags: ["autodocs"],
    argTypes: {
        field: { control: "text" },
        label: { control: "text" },
        placeholder: { control: "text" },
        isMulti: { control: "boolean" },
        isDisabled: { control: "boolean" },
    },
    args: {
        field: "mySelect",
        label: "Select Option",
        placeholder: "Choose...",
        options: [
            { label: "Option 1", value: "opt1" },
            { label: "Option 2", value: "opt2" },
            { label: "Option 3", value: "opt3" },
        ],
        isMulti: false,
        isDisabled: false,
    },
} satisfies Meta<InformedSelectProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const MultiSelect: Story = {
    args: {
        isMulti: true,
    },
};

export const Disabled: Story = {
    args: {
        isDisabled: true,
    },
};
