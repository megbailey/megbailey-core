import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { Form } from "informed";

type WrapperProps = {
    children: ReactNode;
};

export function renderWithForm(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
    function Wrapper({ children }: WrapperProps) {
        return <Form>{children}</Form>;
    }

    return render(ui, { wrapper: Wrapper, ...options });
}

export function createFile(name: string, size: number, type: string): File {
    const buffer = new ArrayBuffer(size);
    return new File([buffer], name, { type });
}
