import type { FocusEvent, MouseEvent, SyntheticEvent } from "react";

export type FormFieldChangeEvent<TValue> = {
    value: TValue;
    name?: string;
    field?: string;
};

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

export type ToggleSwitchChangeEvent = MouseEvent<HTMLButtonElement> & {
    value: boolean;
};

export function isCallableFunction<T extends (...args: never[]) => unknown>(
    func: unknown,
    label = "Callback"
): func is T {
    if (func && typeof func === "function") {
        return true;
    }
    console.warn(`${label} prop is not a callable function.`);
    return false;
}

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

export type FormFieldBlurHandler<TValue> = (
    event: FormFieldChangeEvent<TValue>,
    nativeEvent: FocusEvent
) => void;

export type FormFieldChangeHandler<TValue> = (
    event: FormFieldChangeEvent<TValue>,
    nativeEvent?: SyntheticEvent
) => void;
