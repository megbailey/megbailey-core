import type { InputHTMLAttributes } from "react";
import type { FieldProps } from "informed";

export type UploadResult = { src: string } | string;

export type ValidationResult = { valid: true; error?: null } | { valid: false; error: string };

export type ImageDimensions = {
    width: number;
    height: number;
};

export type UploadErrorResponse = {
    response?: {
        status?: number | string;
        statusText?: string;
        message?: string;
    };
};

export function getUploadErrorMessage(error: unknown): string {
    if (error && typeof error === "object" && "response" in error) {
        const response = (error as UploadErrorResponse).response;
        const status = response?.status ?? "Unknown";
        const statusText = response?.statusText ?? "Error";
        const message = response?.message ?? "An error occurred during upload.";
        return `${status} ${statusText}. ${message}`;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "An error occurred during upload.";
}

export type DropzoneAccept = "image" | "document";
export type DropzoneAspectRatio = "1:1" | "3:2" | "4:3" | "4:5" | "9:16" | "16:9";

export type DropzoneUserProps = {
    field: string;
    className?: string;
    label?: string;
    helperText?: string;
    accept?: DropzoneAccept | string;
    isMulti?: boolean;
    isRequired?: boolean;
    tooltip?: boolean;
    initialValue?: string[];
    aspectRatio?: DropzoneAspectRatio | string;
    imageMinimumWidth?: number;
    imageMinimumHeight?: number;
    imageMaximumWidth?: number;
    imageMaximumHeight?: number;
    maxFileSize?: number;
    onDrop?: (result: UploadResult) => void;
    uploadFilePromise: (file: File) => Promise<UploadResult>;
    uploadsURL: string;
    onItemRemove?: (index: number) => void;
};

export type DropzoneProps = DropzoneUserProps &
    Omit<FieldProps<DropzoneUserProps>, "name"> &
    Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "onDrop" | "accept" | "multiple" | "type" | "value" | "defaultValue"
    >;

export type DropItemProps = {
    type: string;
    src: string;
    uploadsURL: string;
    onRemove: () => void;
};
