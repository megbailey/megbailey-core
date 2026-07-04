import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "informed";
import { fn } from "storybook/test";
import Dropzone from "./Dropzone";
import type { UploadResult } from "../types";

const mockUploadFilePromise = (file: File): Promise<UploadResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ src: file.name });
        }, 1000);
    });
};

const meta = {
    title: "Components/Form Elements/Dropzone",
    component: Dropzone,
    decorators: [
        (Story) => (
            <Form>
                <div style={{ width: "450px" }}>
                    <Story />
                </div>
            </Form>
        ),
    ],
    argTypes: {
        label: { control: "text" },
        helperText: { control: "text" },
        accept: {
            control: "select",
            options: ["image", "document"],
        },
        isMulti: { control: "boolean" },
        isRequired: { control: "boolean" },
        aspectRatio: {
            control: "select",
            options: ["1:1", "3:2", "4:3", "4:5", "9:16", "16:9"],
        },
    },
    args: {
        field: "fileUpload",
        label: "Upload Documents or Images",
        helperText: "Max file size is 2MB. Supports images/documents.",
        accept: "image",
        isMulti: false,
        isRequired: false,
        uploadsURL: "https://example.com/uploads",
        uploadFilePromise: mockUploadFilePromise,
        onDrop: fn(),
        onItemRemove: fn(),
    },
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageUpload: Story = {};

export const DocumentUpload: Story = {
    args: {
        accept: "document",
        label: "Upload PDF or Word Documents",
    },
};

export const MultiUpload: Story = {
    args: {
        isMulti: true,
        label: "Upload Multiple Images",
    },
};
