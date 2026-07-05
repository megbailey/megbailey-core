import type { Meta, StoryObj } from "@storybook/react-vite";
import DisclosureTree, { DisclosureTreeItemProps } from "./DisclosureTree";

const mockItems: DisclosureTreeItemProps[] = [
    {
        id: "1",
        parent_id: null,
        item: <p>Item 1</p>,
        items: [
            {
                id: "30",
                parent_id: "1",
                item: <p>Item 1a</p>,
            },
            {
                id: "31",
                parent_id: "1",
                item: <p>Item 1b</p>,
            },
        ],
    },
    {
        id: "2",
        parent_id: null,
        item: <p>Item 2</p>,
    },
    {
        id: "3",
        parent_id: null,
        item: <p>Item 3</p>,
        items: [
            {
                id: "32",
                parent_id: "3",
                item: <p>Item 3a</p>,
            },
            {
                id: "33",
                parent_id: "3",
                item: <p>Item 3b</p>,
            },
        ],
    },
    {
        id: "4",
        parent_id: null,
        item: <p>Item 4</p>,
    },
];

const meta = {
    title: "Components/DisclosureTree",
    component: DisclosureTree,
    parameters: {
        layout: "padded",
    },
    argTypes: {
        allowMultipleExpanded: { control: "boolean" },
        nested: {
            control: "boolean",
            description:
                "When true, items with children are rendered as expandable branches. When false, all items render flat.",
        },
        collapseOnBlur: { control: "boolean" },
    },
    args: {
        id: "story-tree",
        items: mockItems,
        allowMultipleExpanded: true,
        nested: true,
        collapseOnBlur: false,
    },
} satisfies Meta<typeof DisclosureTree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
