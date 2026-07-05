import type { KeyboardEvent, ReactNode } from "react";

export type DisclosureTreeItemProps = {
    id: string;
    parent_id: string | null;
    active?: boolean;
    item: ReactNode;
    items?: DisclosureTreeItemProps[];
};

export type DisclosureTreeProps = {
    id: string;
    items: DisclosureTreeItemProps[];
    allowMultipleExpanded?: boolean;
    preExpandedIds?: string[];
    collapseOnLoad?: boolean;
    collapseOnBlur?: boolean;
    /* When true (default), items with children are rendered as expandable branches.
     * When false, all items are rendered flat without expansion controls. */
    nested?: boolean;
    onKeyEscape?: (e: KeyboardEvent<any>) => void;
};

export type TreeNodeProps = {
    level: number;
    treeKey: string;
    parent_id?: string | null;
    nested?: boolean;
    onKeyEscape?: (e: KeyboardEvent<any>) => void;
    allowMultipleExpanded?: boolean;
    item: DisclosureTreeItemProps;
};

export type BranchProps = {
    treeKey: string;
    level: number;
    parent_id?: string | null;
    item: DisclosureTreeItemProps;
    onKeyEscape?: (e: KeyboardEvent<any>) => void;
    allowMultipleExpanded?: boolean;
};

export type LeafProps = {
    className?: string;
    id: string;
    active?: boolean;
    level: number;
    onKeyDown?: (e: KeyboardEvent<any>) => void;
    isBranch?: boolean;
    item?: DisclosureTreeItemProps;
    [key: string]: any;
};

export type ExpansionControlsProps = {
    controlsId: string;
    active?: boolean;
    expanded: boolean;
    onClick: () => void;
    onKeyDown?: (e: KeyboardEvent<any>) => void;
};
