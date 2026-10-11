type FileSystemEntryLike = {
    isFile: boolean;
    isDirectory: boolean;
    name: string;
    file?: (success: (file: File) => void, error?: (error: DOMException) => void) => void;
    createReader?: () => {
        readEntries: (
            success: (entries: FileSystemEntryLike[]) => void,
            error?: (error: DOMException) => void
        ) => void;
    };
};

type EntryItem = {
    webkitGetAsEntry?: () => FileSystemEntryLike | null;
};

export function fileWithRelativePath(file: File, relativePath: string): File {
    if (!relativePath.includes("/")) {
        return file;
    }

    const next = new File([file], file.name, {
        type: file.type,
        lastModified: file.lastModified,
    });
    Object.defineProperty(next, "webkitRelativePath", {
        configurable: true,
        enumerable: true,
        value: relativePath,
    });
    return next;
}

function fileFromEntry(entry: FileSystemEntryLike): Promise<File> {
    return new Promise((resolve, reject) => {
        if (!entry.file) {
            reject(new Error("Could not read file."));
            return;
        }
        entry.file(resolve, reject);
    });
}

function readAllEntries(entry: FileSystemEntryLike): Promise<FileSystemEntryLike[]> {
    const reader = entry.createReader?.();
    if (!reader) {
        return Promise.resolve([]);
    }

    const collected: FileSystemEntryLike[] = [];
    return new Promise((resolve, reject) => {
        const pull = () => {
            reader.readEntries((batch) => {
                if (batch.length === 0) {
                    resolve(collected);
                    return;
                }
                collected.push(...batch);
                pull();
            }, reject);
        };
        pull();
    });
}

async function collectEntry(
    entry: FileSystemEntryLike,
    parentPath: string,
    output: File[]
): Promise<void> {
    const path = parentPath ? `${parentPath}/${entry.name}` : entry.name;
    if (entry.isFile) {
        const file = await fileFromEntry(entry);
        output.push(fileWithRelativePath(file, path));
        return;
    }

    if (!entry.isDirectory) {
        return;
    }

    const children = await readAllEntries(entry);
    for (const child of children) {
        await collectEntry(child, path, output);
    }
}

export async function filesFromDataTransfer(transfer: DataTransfer): Promise<File[]> {
    const items = transfer.items as ArrayLike<EntryItem> | undefined;
    if (items && items.length > 0) {
        const entries: FileSystemEntryLike[] = [];
        for (let index = 0; index < items.length; index++) {
            const entry = items[index]?.webkitGetAsEntry?.();
            if (entry) {
                entries.push(entry);
            }
        }

        if (entries.length > 0) {
            const collected: File[] = [];
            for (const entry of entries) {
                await collectEntry(entry, "", collected);
            }
            return collected;
        }
    }

    return Array.from(transfer.files ?? []);
}
