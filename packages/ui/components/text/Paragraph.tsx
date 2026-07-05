import type { ParagraphProps } from "./types";

export type { ParagraphProps } from "./types";

const Paragraph = ({ text, children, className }: ParagraphProps) => {
    return <p className={className}>{text || children}</p>;
};

export default Paragraph;
