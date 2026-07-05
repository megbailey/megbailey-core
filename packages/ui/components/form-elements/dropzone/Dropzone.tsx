import { useState, useEffect, useRef, useMemo } from "react";
import clsx from "clsx";
import { useField, type FieldProps } from "informed";
import uniqid from "uniqid";
import dompurify from "dompurify";

import Icon from "../../icon/Icon";
import Button from "../../button/Button";
import type {
    DropItemProps,
    DropzoneProps,
    DropzoneUserProps,
    ImageDimensions,
    UploadResult,
    ValidationResult,
} from "./types";
import { getUploadErrorMessage } from "./types";
import "./Dropzone.css";

export type {
    DropItemProps,
    DropzoneAccept,
    DropzoneAspectRatio,
    DropzoneProps,
    DropzoneUserProps,
    ImageDimensions,
    UploadResult,
    ValidationResult,
} from "./types";

export const DEFAULT_MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const propValues = {
    accept: ["image", "document"],
    isMulti: [true, false],
    aspectRatio: ["1:1", "3:2", "4:3", "4:5", "9:16", "16:9"],
};

function formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
    }
    if (bytes >= 1024) {
        return `${(bytes / 1024).toFixed(1)}KB`;
    }
    return `${bytes}B`;
}

const BarLoader = ({ loading }: { loading: boolean }) => {
    if (!loading) return null;
    return (
        <div className="dropzone__loader">
            <div className="dropzone__loader-bar" />
        </div>
    );
};

const Dropzone = (props: DropzoneProps) => {
    const { render, userProps, ref, fieldState, fieldApi } = useField<DropzoneUserProps, string[]>(
        props as FieldProps<DropzoneUserProps>
    );
    const { setValue, setError } = fieldApi;

    const {
        className,
        label,
        helperText,
        accept = "image",
        isMulti = false,
        isRequired = false,
        initialValue = [],
        aspectRatio,
        imageMinimumWidth,
        imageMinimumHeight,
        imageMaximumWidth,
        imageMaximumHeight,
        maxFileSize = DEFAULT_MAX_FILE_SIZE,
        onDrop: callback,
        uploadFilePromise,
        uploadsURL,
        onItemRemove,
        ...other
    } = userProps;
    const [dragOver, setDragOver] = useState(false);
    const [fileDropError, setFileDropError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const dropzoneID = useMemo(() => `dropzone-${uniqid()}`, []);
    const isProcessingRef = useRef(false);

    const acceptedDocumentTypes: Record<string, string> = {
        "application/pdf": "pdf",
        "application/msword": "doc",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
        "application/vnd.ms-excel": "xls",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
        "application/vnd.ms-powerpoint": "ppt",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
        "text/csv": "csv",
    };

    const acceptedImageTypes: Record<string, string> = {
        "image/avif": "avif",
        "image/gif": "gif",
        "image/png": "png",
        "image/jpg": "jpg",
        "image/jpeg": "jpeg",
        "image/webp": "webp",
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(true);
    };

    const onDragLeave = () => setDragOver(false);

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        const selectedFile = e?.dataTransfer?.files[0];
        if (selectedFile) processSelectedFile(selectedFile);
    };

    const onFilesystemSelect = () => {
        const selectedFile = ref.current?.files?.[0];
        if (selectedFile) processSelectedFile(selectedFile);
    };

    const processSelectedFile = async (selectedFile: File) => {
        if (!selectedFile) return;

        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        try {
            const result = await validateFile(selectedFile);
            if (!result.valid) {
                setFileDropError(result.error ?? null);
                return;
            }

            const uploadResult = await uploadFile(selectedFile);
            setFileDropError(null);
            if (callback) callback(uploadResult);
        } finally {
            isProcessingRef.current = false;
            if (ref.current) ref.current.value = "";
        }
    };

    // Validation occurs BEFORE file is uploaded to the server
    async function validateFile(file: File): Promise<ValidationResult> {
        if (!file) {
            return { valid: false, error: "No file selected." };
        }

        // 1. File Type validation
        const typeValidation = validateFileType(file);
        if (!typeValidation.valid) return typeValidation;

        // 2. Size validation
        const sizeValidation = validateFileSize(file);
        if (!sizeValidation.valid) return sizeValidation;

        // 3. Image-specific validations
        if (accept === "image") {
            const imageMeta = await getImageMetadata(file).catch(() => null);

            if (!imageMeta) {
                return { valid: false, error: "Unable to read image file." };
            }

            const dimensionValidation = validateImageDimensions(imageMeta);
            if (!dimensionValidation.valid) return dimensionValidation;

            const aspectValidation = validateAspectRatio(imageMeta);
            if (!aspectValidation.valid) return aspectValidation;
        }

        return { valid: true, error: null };
    }

    function validateFileType(file: File): ValidationResult {
        if (accept === "image" && !Object.keys(acceptedImageTypes).includes(file.type)) {
            return {
                valid: false,
                error: `Please provide an image. Accepted: ${Object.values(acceptedImageTypes).join(", ")}`,
            };
        }

        if (accept === "document" && !Object.keys(acceptedDocumentTypes).includes(file.type)) {
            return {
                valid: false,
                error: `Please provide a document. Accepted: ${Object.values(acceptedDocumentTypes).join(", ")}`,
            };
        }

        return { valid: true };
    }

    function validateFileSize(file: File): ValidationResult {
        if (file.size > maxFileSize) {
            const sizeLabel = formatFileSize(file.size);
            const limitLabel = formatFileSize(maxFileSize);
            return {
                valid: false,
                error: `${accept} is too large for upload! File size is ${sizeLabel}.\nFile size limit is ${limitLabel}.`,
            };
        }
        return { valid: true };
    }

    async function getImageMetadata(file: File): Promise<ImageDimensions> {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                resolve({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                });
                URL.revokeObjectURL(img.src);
            };

            img.onerror = (err) => {
                URL.revokeObjectURL(img.src);
                reject(err);
            };
            img.src = URL.createObjectURL(file);
        });
    }

    function validateImageDimensions({ width, height }: ImageDimensions): ValidationResult {
        let dimension_error = "";
        if (imageMinimumWidth && imageMinimumHeight) {
            dimension_error += ` Minimum ${imageMinimumWidth}px (width) x ${imageMinimumHeight}px (height)`;
        } else if (imageMinimumWidth || imageMinimumHeight) {
            dimension_error += imageMinimumWidth ? ` Minimum ${imageMinimumWidth}px (width)` : "";
            dimension_error += imageMinimumHeight
                ? ` Minimum ${imageMinimumHeight}px (height)`
                : "";
        }

        if (imageMaximumWidth && imageMaximumHeight) {
            dimension_error += ` Maximum ${imageMaximumWidth}px (width) x ${imageMaximumHeight}px (height)`;
        } else if (imageMaximumWidth || imageMaximumHeight) {
            dimension_error += imageMaximumWidth ? ` Maximum ${imageMaximumWidth}px (width)` : "";
            dimension_error += imageMaximumHeight
                ? ` Maximum ${imageMaximumHeight}px (height)`
                : "";
        }

        dimension_error = `Image did not meet the dimension requirement(s): ${dimension_error}`;

        if (imageMinimumWidth && width < imageMinimumWidth) {
            return { valid: false, error: dimension_error };
        }

        if (imageMaximumWidth && width > imageMaximumWidth) {
            return { valid: false, error: dimension_error };
        }

        if (imageMinimumHeight && height < imageMinimumHeight) {
            return { valid: false, error: dimension_error };
        }

        if (imageMaximumHeight && height > imageMaximumHeight) {
            return { valid: false, error: dimension_error };
        }

        return { valid: true };
    }

    function validateAspectRatio({ width, height }: ImageDimensions): ValidationResult {
        if (!aspectRatio) return { valid: true };

        const ratio = width / height;

        const ratios: Record<string, number> = {
            "1:1": 1,
            "3:2": 3 / 2,
            "4:3": 4 / 3,
            "4:5": 4 / 5,
            "9:16": 9 / 16,
            "16:9": 16 / 9,
        };

        const expected = ratios[aspectRatio];

        if (!expected) return { valid: true };

        const tolerance = 0.01; // avoid floating point issues

        if (Math.abs(ratio - expected) > tolerance) {
            return {
                valid: false,
                error: `Image must have aspect ratio ${aspectRatio}.`,
            };
        }

        return { valid: true };
    }

    function uploadFile(file: File) {
        setIsLoading(true);
        // uploadFilePromise must return a string of the filename that was uploaded
        return uploadFilePromise(file)
            .then((result: UploadResult) => {
                const filename = typeof result === "string" ? result : result.src;
                const currentValue = Array.isArray(fieldState.value) ? fieldState.value : [];
                if (isMulti) {
                    setValue([...currentValue, filename]);
                } else {
                    setValue([filename]);
                }
                setError(null);
                setIsLoading(false);
                return result;
            })
            .catch((error: unknown) => {
                setFileDropError(getUploadErrorMessage(error));
                setIsLoading(false);
                throw error;
            });
    }

    function removeItem(index: number) {
        const currentValue = Array.isArray(fieldState.value) ? fieldState.value : [];
        let copiedState = [...currentValue];
        copiedState.splice(index, 1);
        setValue(copiedState);
        if (onItemRemove) onItemRemove(index);
    }

    const valueArray = Array.isArray(fieldState.value) ? fieldState.value : [];

    return render(
        <div className={clsx("dropzone-field", "form-element", className)}>
            {label && (
                <label
                    className={clsx("dropzone-field__label", "form-element__label", {
                        "dropzone-field__label--required": isRequired === true,
                    })}
                    htmlFor={dropzoneID}
                >
                    {label}
                </label>
            )}
            {((!isMulti && valueArray.length <= 0) || isMulti) && (
                <div
                    className={clsx("dropzone", {
                        "dropzone--drag-over": dragOver,
                        "dropzone--error": fieldState.error || fileDropError,
                    })}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <input
                        {...other}
                        id={dropzoneID}
                        ref={ref}
                        type="file"
                        style={{ display: "none" }}
                        onChange={onFilesystemSelect}
                        accept={
                            accept === "image"
                                ? Object.keys(acceptedImageTypes).join(",")
                                : Object.keys(acceptedDocumentTypes).join(",")
                        }
                        multiple={isMulti}
                    />
                    {isLoading && <BarLoader loading={isLoading} />}
                    <div className="dropzone__content">
                        <p className="dropzone__text">
                            {dragOver ? (
                                <>
                                    Release to upload
                                    <br />
                                    or
                                </>
                            ) : (
                                <>
                                    Drag {accept}
                                    {isMulti ? "s" : ""} here to upload
                                    <br />
                                    or
                                </>
                            )}
                        </p>
                        <Button
                            text="Browse Files"
                            size="small"
                            onClick={() => {
                                const inputEl = document.getElementById(dropzoneID);
                                if (inputEl) inputEl.click();
                            }}
                        />
                        {fileDropError !== null && (
                            <p className="dropzone__error-message">Error: {fileDropError}</p>
                        )}
                    </div>
                </div>
            )}
            <div className="dropzone__items">
                {valueArray.length > 0 && (
                    <ul>
                        {valueArray.map((item: string, index: number) => {
                            return (
                                <DropItem
                                    key={index}
                                    type={accept}
                                    src={item}
                                    uploadsURL={uploadsURL}
                                    onRemove={() => removeItem(index)}
                                />
                            );
                        })}
                    </ul>
                )}
            </div>
            {helperText ? (
                <span
                    className="dropzone__helper form-element__helper"
                    dangerouslySetInnerHTML={{ __html: dompurify.sanitize(helperText) }}
                ></span>
            ) : null}
            {fieldState.error ? (
                <span className="dropzone-field__error-text form-element__error-text">
                    {String(fieldState.error)}
                </span>
            ) : null}
        </div>
    );
};

const DropItem = (props: DropItemProps) => {
    const { type, src, uploadsURL, onRemove } = props;
    const [itemSize, setItemSize] = useState<string | null>(null);
    const [itemDimensions, setItemDimensions] = useState<{ width: number; height: number } | null>(
        null
    );
    const itemRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        fetch(`${uploadsURL}/${src}`, {
            signal,
        })
            .then((r) => r.blob())
            .then((r) => {
                setItemSize(`${(r.size / 1024).toFixed(1)}`);
            })
            .catch((e) => console.log(e));

        if (itemRef.current) {
            itemRef.current.onload = function () {
                if (itemRef.current && type === "image") {
                    setItemDimensions({
                        width: itemRef.current.naturalWidth,
                        height: itemRef.current.naturalHeight,
                    });
                }
            };
        }
        // Abort promise if component unmounted
        return () => controller.abort();
    }, [src, type, uploadsURL]);

    return (
        <li className="dropzone__item">
            {type === "document" && <Icon name={"file"} />}
            {type === "image" && (
                <img
                    ref={itemRef}
                    className="dropzone__image-thumbnail"
                    src={`${uploadsURL}/${src}`}
                    alt="the uploaded image"
                />
            )}
            <div className="dropzone__file-info">
                <div className="dropzone__filename">{src}</div>
                <div className="dropzone__file-stats">
                    {itemDimensions && (
                        <span className="dropzone__image-dimension">
                            {itemDimensions.width}px x {itemDimensions.height}px
                        </span>
                    )}
                    <span className="dropzone__file-size">{itemSize}KB</span>
                </div>
            </div>
            <Button
                className="dropzone__delete"
                icon={{
                    name: "trash-can",
                    size: "normal",
                    theme: "solid",
                }}
                onClick={onRemove}
            />
        </li>
    );
};

export default Dropzone;
