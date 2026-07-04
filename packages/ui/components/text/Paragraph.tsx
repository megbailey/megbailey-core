import { ReactNode } from "react";

type ParagraphProps = {
    text?: string;
    children?: ReactNode;
    className?: string;
};

const Paragraph = ({ text, children, className }: ParagraphProps) => {
    return <p className={className}>{text || children}</p>;
};

export default Paragraph;
