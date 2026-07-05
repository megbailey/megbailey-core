import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

vi.mock("uniqid", () => ({
    default: vi.fn(() => "test-id"),
}));

const { mockGetAPIData, apolloQueryResult } = vi.hoisted(() => ({
    mockGetAPIData: vi.fn(),
    apolloQueryResult: {
        loading: false,
        error: undefined,
        data: {
            items: [
                { id: "1", label: "Option A", name: "Option A" },
                { id: "2", label: "Option B", name: "Option B" },
            ],
        },
    },
}));

vi.mock("@apollo/client", () => ({
    useLazyQuery: () => [mockGetAPIData, apolloQueryResult],
}));

global.fetch = vi.fn().mockResolvedValue({
    blob: () => Promise.resolve(new Blob(["test"])),
}) as typeof fetch;

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});
