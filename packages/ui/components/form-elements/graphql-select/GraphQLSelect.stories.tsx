import type { Meta, StoryObj } from "@storybook/react-vite";
import { MockedProvider } from "@apollo/client/testing";
import { Form } from "informed";
import { fn } from "storybook/test";
import gql from "graphql-tag";
import GraphQLSelect from "./GraphQLSelect";

const GET_ITEMS = gql`
    query GetItems {
        items {
            id
            name
            label
        }
    }
`;

const mocks = [
    {
        request: {
            query: GET_ITEMS,
            variables: {},
        },
        result: {
            data: {
                items: [
                    { id: "1", name: "GraphQL Option A", label: "Option A", value: "a" },
                    { id: "2", name: "GraphQL Option B", label: "Option B", value: "b" },
                    { id: "3", name: "GraphQL Option C", label: "Option C", value: "c" },
                ],
            },
        },
    },
];

const meta = {
    title: "Components/Form Elements/GraphQLSelect",
    component: GraphQLSelect,
    decorators: [
        (Story) => (
            <MockedProvider mocks={mocks} addTypename={false}>
                <Form>
                    <div style={{ width: "300px" }}>
                        <Story />
                    </div>
                </Form>
            </MockedProvider>
        ),
    ],
    argTypes: {
        label: { control: "text" },
        endpointDataPath: { control: "text" },
    },
    args: {
        label: "GraphQL Source Select",
        field: "graphqlSelect",
        endpointDataPath: "items",
        query: GET_ITEMS,
        queryVariables: {},
        onChange: fn(),
    },
} satisfies Meta<typeof GraphQLSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
