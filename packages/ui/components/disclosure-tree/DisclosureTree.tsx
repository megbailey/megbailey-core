import {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useMemo,
    createContext,
    useContext,
    useImperativeHandle,
} from "react";
import clsx from "clsx";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import ExpansionControls from "./ExpansionControls";

export type DisclosureTreeItemProps = {
    id: string;
    parent_id: string | null;
    active?: boolean;
    item: React.ReactNode;
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
    onKeyEscape?: (e: React.KeyboardEvent<any>) => void;
};

type BranchProps = {
    treeKey: string;
    level: number;
    parent_id?: string | null;
    item: DisclosureTreeItemProps;
    onKeyEscape?: (e: React.KeyboardEvent<any>) => void;
    allowMultipleExpanded?: boolean;
};

type LeafProps = {
    className?: string;
    id: string;
    active?: boolean;
    level: number;
    onKeyDown?: (e: React.KeyboardEvent<any>) => void;
    isBranch?: boolean;
    item?: DisclosureTreeItemProps;
    [key: string]: any;
};

const DisclosureTreeContext = createContext<any>(null);

const dTreeClassName = "c-disclosure-tree";
const dTreeItemClassName = "c-disclosure-tree-item";
const dTreeBranchClassName = "c-disclosure-tree-branch";
const dTreeLeafClassName = "c-disclosure-tree-leaf";

const DisclosureTree = forwardRef<any, DisclosureTreeProps>(
    (
        {
            id,
            items,
            allowMultipleExpanded = true,
            preExpandedIds = [],
            collapseOnLoad = false,
            collapseOnBlur = false,
            nested = true,
            onKeyEscape,
            ...other
        },
        ref
    ) => {
        const [expandedIds, setExpandedIds] = useState<string[]>(preExpandedIds);
        const treeRef = useRef<HTMLElement>(null);
        const nodeRefs = useRef<Record<string, any>>({});

        const flattenedItems = useMemo(() => flattenItems(items), [items]);
        // If collapseOnBlur === true, a click outside will close any expanded tree branches
        useOnClickOutside(treeRef, () => {
            if (collapseOnBlur === true) {
                setExpandedIds([]);
            }
        });

        // Allow parents to access internal state through refs
        useImperativeHandle(ref, () => ({
            getExpandedIds: () => {
                return expandedIds;
            },
        }));

        return (
            <DisclosureTreeContext.Provider
                value={{
                    nodeRefs,
                    flattenedItems,
                    expandedIds,
                    setExpandedIds,
                }}
            >
                <ul
                    id={`disclosure-tree-${id}`}
                    className={`${dTreeClassName} c-list--ul`}
                    /* Chaining together two refs.
                     * Local treeRef controls the onClickOutside event and the forwarded ref
                     * is customized via useImperativeHandle to allow any parent to access the internal state */
                    ref={(el) => {
                        (treeRef as any).current = el;
                        if (ref) {
                            if (typeof ref === "function") {
                                ref(el);
                            } else {
                                (ref as any).current = el;
                            }
                        }
                    }}
                    {...other}
                >
                    {collapseOnLoad === false &&
                        flattenedItems
                            .filter((x: DisclosureTreeItemProps) => x.parent_id === null)
                            .map((item: DisclosureTreeItemProps) => (
                                <TreeNode
                                    key={item.id}
                                    level={1}
                                    nested={nested}
                                    treeKey={id}
                                    onKeyEscape={onKeyEscape}
                                    allowMultipleExpanded={allowMultipleExpanded}
                                    item={item}
                                />
                            ))}
                </ul>
            </DisclosureTreeContext.Provider>
        );
    }
);

export default DisclosureTree;

const TreeNode = ({
    level,
    treeKey,
    parent_id = null,
    nested = true,
    onKeyEscape,
    allowMultipleExpanded,
    item,
}: {
    level: number;
    treeKey: string;
    parent_id?: string | null;
    nested?: boolean;
    onKeyEscape?: (e: React.KeyboardEvent<any>) => void;
    allowMultipleExpanded?: boolean;
    item: DisclosureTreeItemProps;
}) => {
    if (nested === true && (item?.items?.length ?? 0) > 0) {
        return (
            <li className={clsx(dTreeItemClassName, dTreeBranchClassName)}>
                <Branch
                    treeKey={treeKey}
                    parent_id={parent_id}
                    level={level}
                    item={item}
                    onKeyEscape={onKeyEscape}
                    allowMultipleExpanded={allowMultipleExpanded}
                />
            </li>
        );
    }

    return (
        <li className={clsx(dTreeItemClassName, dTreeLeafClassName)}>
            <Leaf
                className="c-list--item"
                id={item.id}
                level={level}
                isBranch={false}
                item={item}
                onKeyDown={onKeyEscape}
            />
        </li>
    );
};

const Branch = ({
    treeKey,
    level,
    parent_id = null,
    item,
    onKeyEscape,
    allowMultipleExpanded = true,
}: BranchProps) => {
    const { nodeRefs, flattenedItems, expandedIds, setExpandedIds } =
        useContext(DisclosureTreeContext);
    const { id, active } = item;
    const [expandedState, setExpandedState] = useState(expandedIds.includes(id));
    // Use item.items directly since flattenItems already built the nested structure
    const children: DisclosureTreeItemProps[] = item.items ?? [];
    const controlsRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!expandedIds.includes(id)) {
            setExpandedState(false);
        }
    }, [expandedIds, id]);

    function expand() {
        const newExpandedState = !expandedState;
        setExpandedState(newExpandedState);
        if (allowMultipleExpanded === false) {
            if (parent_id === null && newExpandedState === true) {
                setExpandedIds([id]);
            }
            if (expandedIds.includes(parent_id) && newExpandedState === true) {
                setExpandedIds([...expandedIds, id]);
            }
        } else {
            let copiedState = [...expandedIds];
            if (newExpandedState === true && !expandedIds.includes(id)) {
                setExpandedIds([...expandedIds, id]);
            } else if (newExpandedState === false && expandedIds.includes(id)) {
                remove(copiedState, id);
                setExpandedIds(copiedState);
            }
        }
    }

    // If escape is pressed on a child node, close current branch and redirect focus to controls
    function onKeyEscapeChild(e: React.KeyboardEvent<any>) {
        if (controlsRef.current !== null && e.key === "Escape") {
            setExpandedState(false);
            controlsRef.current.focus();
        }
    }

    function onKeyArrowLeftRight(e: React.KeyboardEvent<any>) {
        switch (e.key) {
            case "ArrowLeft":
                if (nodeRefs.current[id] !== null) {
                    nodeRefs.current[id].focus();
                }
                break;
            case "ArrowRight":
                if (controlsRef.current !== null) {
                    controlsRef.current.focus();
                }
                break;
        }
    }

    return (
        <>
            <div className={dTreeBranchClassName}>
                <Leaf
                    id={item.id}
                    level={level}
                    isBranch={true}
                    item={item}
                    onKeyDown={(e: React.KeyboardEvent<any>) => {
                        if (onKeyEscape) {
                            onKeyEscape(e);
                        }
                        onKeyArrowLeftRight(e);
                    }}
                />
                <ExpansionControls
                    ref={controlsRef}
                    controlsId={`${treeKey}--group-${id}`}
                    active={active}
                    expanded={expandedState}
                    onClick={expand}
                    onKeyDown={onKeyArrowLeftRight}
                />
            </div>
            <ul
                id={`${treeKey}--group-${id}`}
                role="group"
                className={clsx("tree-node-group", {
                    ["tree-node-group--expanded"]: expandedState === true,
                })}
            >
                {expandedState &&
                    children.map((childItem: DisclosureTreeItemProps) => (
                        <TreeNode
                            key={childItem.id}
                            parent_id={id}
                            level={level + 1}
                            item={childItem}
                            treeKey={treeKey}
                            allowMultipleExpanded={allowMultipleExpanded}
                            onKeyEscape={onKeyEscapeChild}
                        />
                    ))}
            </ul>
        </>
    );
};

const Leaf = forwardRef<any, LeafProps>(
    ({ className = null, id, level, onKeyDown, isBranch = false, item }, ref) => {
        const { nodeRefs, expandedIds } = useContext(DisclosureTreeContext);

        const onKeyArrowUpDown = (e: React.KeyboardEvent<any>) => {
            switch (e.key) {
                case "ArrowUp":
                    const prevItems = Object.keys(nodeRefs.current).filter(
                        (x) => x < id && nodeRefs.current[x] !== null
                    );
                    const prev = prevItems[prevItems.length - 1];
                    if (prev) {
                        nodeRefs.current[prev].focus();
                    }
                    break;
                case "ArrowDown":
                    const nextItems = Object.keys(nodeRefs.current).filter(
                        (x) => x > id && nodeRefs.current[x] !== null
                    );
                    const next = nextItems[0];
                    if (next) {
                        nodeRefs.current[next].focus();
                    }
                    break;
            }
        };

        //('Leaf render', id, level, isBranch, item)
        const isExpanded = expandedIds.includes(id);
        return (
            <div
                className={clsx(dTreeLeafClassName, className)}
                ref={(el: any) => {
                    nodeRefs.current[id] = el;
                    if (ref) {
                        if (typeof ref === "function") {
                            ref(el);
                        } else {
                            (ref as any).current = el;
                        }
                    }
                }}
                onKeyDown={(e: React.KeyboardEvent<any>) => {
                    if (onKeyDown) {
                        onKeyDown(e);
                    }
                    onKeyArrowUpDown(e);
                }}
                tabIndex={0}
            >
                {item.item}
            </div>
        );
    }
);

function remove(array: any[], value: any) {
    const index = array.indexOf(value);
    if (index > -1) {
        array.splice(index, 1);
    }
}

/*
 * Utility function to flatten a multi-dimensional array of items into a single dimension
 * assigning a sequential id if one does not exist, creating references to parent and any children,
 * and removing any items set not to display.
 */
function flattenItems(treeItems: DisclosureTreeItemProps[]) {
    let flattenedTree: DisclosureTreeItemProps[] = [];
    let internalCount = 1;

    function recurseHelper(tree: DisclosureTreeItemProps[], parent_id: string | null) {
        for (const item of tree) {
            // item is empty or is explictly set to not display
            if (Object.keys(item).length === 0) {
                continue;
            }

            const node: DisclosureTreeItemProps = {
                id: item.id ? item.id : `${internalCount}`,
                // Start with an empty array — children are populated after recursion
                items: [],
                parent_id: parent_id,
                item: item.item,
            };

            if (flattenedTree.find((x) => x.id === node.id)) {
                throw Error(
                    `Multiple Tree nodes have the same ID (${node.id}). IDs must be unique.`
                );
            }

            internalCount += 1;
            flattenedTree.push(node);

            if (!item.items || item.items.length === 0) continue;

            // Recurse into children, then link them onto the parent node
            const childrenStartIndex = flattenedTree.length;
            recurseHelper(item.items, node.id);
            node.items = flattenedTree
                .slice(childrenStartIndex)
                .filter((child) => child.parent_id === node.id);
        }
    }

    recurseHelper(treeItems, null);
    return flattenedTree;
}
