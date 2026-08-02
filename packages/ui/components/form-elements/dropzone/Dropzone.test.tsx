import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Dropzone, { DEFAULT_MAX_FILE_SIZE } from "./Dropzone";
import { createFile, renderWithForm } from "../../../utils/test-utils";
import { getUploadErrorMessage } from "./types";

const defaultProps = {
    field: "fileUpload",
    label: "Upload Documents or Images",
    helperText: "Configurable file size limit. Support images or documents.",
    uploadsURL: "https://example.com/uploads",
    uploadFilePromise: vi.fn().mockResolvedValue({ src: "uploaded.pdf" }),
};

describe("Dropzone", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders image upload copy by default", () => {
        renderWithForm(<Dropzone {...defaultProps} accept="image" />);

        expect(screen.getByText("Upload Documents or Images")).toBeInTheDocument();
        expect(screen.getByText(/Drag image here to upload/i)).toBeInTheDocument();
        expect(
            screen.getByText("Configurable file size limit. Support images or documents.")
        ).toBeInTheDocument();
    });

    it("renders document upload copy when accept is document", () => {
        renderWithForm(
            <Dropzone {...defaultProps} accept="document" label="Upload PDF or Word Documents" />
        );

        expect(screen.getByText("Upload PDF or Word Documents")).toBeInTheDocument();
        expect(screen.getByText(/Drag document here to upload/i)).toBeInTheDocument();
    });

    it("renders plural upload copy when isMulti is true", () => {
        renderWithForm(
            <Dropzone {...defaultProps} accept="image" isMulti label="Upload Multiple Images" />
        );

        expect(screen.getByText(/Drag images here to upload/i)).toBeInTheDocument();
    });

    it("adds the required label class when isRequired is true", () => {
        renderWithForm(<Dropzone {...defaultProps} isRequired />);

        expect(document.querySelector(".dropzone-field__label--required")).toBeInTheDocument();
    });

    it("renders helper text below the dropzone", () => {
        renderWithForm(<Dropzone {...defaultProps} />);

        expect(
            screen.getByText("Configurable file size limit. Support images or documents.")
        ).toBeInTheDocument();
    });

    it("applies a custom className on the root", () => {
        const { container } = renderWithForm(
            <Dropzone {...defaultProps} className="my-dropzone" />
        );

        expect(container.querySelector(".dropzone-field.my-dropzone")).toBeInTheDocument();
    });

    it("hides the drop area after a single file upload", async () => {
        const uploadFilePromise = vi.fn().mockResolvedValue({ src: "photo.png" });

        renderWithForm(
            <Dropzone {...defaultProps} accept="document" uploadFilePromise={uploadFilePromise} />
        );

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, {
            target: { files: [createFile("photo.png", 500, "application/pdf")] },
        });

        await waitFor(() => {
            expect(screen.getByText("photo.png")).toBeInTheDocument();
        });

        expect(screen.queryByText(/Drag document here to upload/i)).not.toBeInTheDocument();
    });

    it("shows uploaded files from initialValue", () => {
        renderWithForm(
            <Dropzone {...defaultProps} accept="document" initialValue={["existing.pdf"]} />
        );

        expect(screen.getByText("existing.pdf")).toBeInTheDocument();
    });

    it("rejects files larger than maxFileSize", async () => {
        renderWithForm(<Dropzone {...defaultProps} accept="document" maxFileSize={1024} />);

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, {
            target: { files: [createFile("large.pdf", 2048, "application/pdf")] },
        });

        await waitFor(() => {
            expect(screen.getByText(/File size limit is 1.0KB/i)).toBeInTheDocument();
        });

        expect(defaultProps.uploadFilePromise).not.toHaveBeenCalled();
    });

    it("rejects unsupported document types", async () => {
        renderWithForm(<Dropzone {...defaultProps} accept="document" />);

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(input, {
            target: { files: [createFile("notes.txt", 100, "text/plain")] },
        });

        await waitFor(() => {
            expect(screen.getByText(/Please provide a document/i)).toBeInTheDocument();
        });
    });

    it("uploads a valid document file", async () => {
        const uploadFilePromise = vi.fn().mockResolvedValue({ src: "report.pdf" });
        const onDrop = vi.fn();

        renderWithForm(
            <Dropzone
                {...defaultProps}
                accept="document"
                uploadFilePromise={uploadFilePromise}
                onDrop={onDrop}
            />
        );

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        const validFile = createFile("report.pdf", 500, "application/pdf");

        fireEvent.change(input, { target: { files: [validFile] } });

        await waitFor(() => {
            expect(uploadFilePromise).toHaveBeenCalledWith(validFile);
            expect(onDrop).toHaveBeenCalledWith({ src: "report.pdf" });
        });
    });

    it("removes an uploaded file when delete is clicked", async () => {
        const user = userEvent.setup();
        const onItemRemove = vi.fn();

        renderWithForm(
            <Dropzone
                {...defaultProps}
                accept="document"
                initialValue={["existing.pdf"]}
                onItemRemove={onItemRemove}
            />
        );

        await user.click(document.querySelector(".dropzone__delete") as HTMLElement);

        await waitFor(() => {
            expect(screen.queryByText("existing.pdf")).not.toBeInTheDocument();
        });

        expect(onItemRemove).toHaveBeenCalledWith(0);
    });

    it("uses the default max file size constant", () => {
        expect(DEFAULT_MAX_FILE_SIZE).toBe(2 * 1024 * 1024);
    });

    it("sets the multiple attribute on the file input when isMulti is true", () => {
        renderWithForm(<Dropzone {...defaultProps} isMulti />);

        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        expect(input.multiple).toBe(true);
    });

    it("shows release copy while dragging over the dropzone", () => {
        renderWithForm(<Dropzone {...defaultProps} accept="image" />);

        const dropzone = document.querySelector(".dropzone") as HTMLElement;
        fireEvent.dragOver(dropzone, { dataTransfer: { files: [] } });

        expect(screen.getByText(/Release to upload/i)).toBeInTheDocument();
    });

    it("renders an image thumbnail for image uploads", () => {
        renderWithForm(<Dropzone {...defaultProps} accept="image" initialValue={["photo.png"]} />);

        expect(document.querySelector(".dropzone__image-thumbnail")).toBeInTheDocument();
    });

    it("renders a file icon for document uploads", () => {
        renderWithForm(
            <Dropzone {...defaultProps} accept="document" initialValue={["report.pdf"]} />
        );

        expect(document.querySelector(".icon--file")).toBeInTheDocument();
    });
});

describe("dropzone/types", () => {
    describe("getUploadErrorMessage", () => {
        it("formats axios-like upload errors", () => {
            const message = getUploadErrorMessage({
                response: {
                    status: 413,
                    statusText: "Payload Too Large",
                    message: "File exceeds limit.",
                },
            });

            expect(message).toBe("413 Payload Too Large. File exceeds limit.");
        });

        it("returns Error message when provided", () => {
            expect(getUploadErrorMessage(new Error("Network failed"))).toBe("Network failed");
        });

        it("returns a generic fallback for unknown errors", () => {
            expect(getUploadErrorMessage("unexpected")).toBe("An error occurred during upload.");
        });
    });
});
