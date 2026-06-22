import { useState, useEffect, createContext, useContext, useRef, useImperativeHandle, forwardRef } from "react";
import clsx from "clsx";
import useOnClickOutside from "../../../utils/useOnClickOutside";
import Button from "../button/Button";
import Icon from "../icon/Icon";
import Tooltip from "../tooltip/Tooltip";

export type LinksTreeItem = {
    id: string;
    parent: string | null;
    children: string[];
    item: {
        active?: boolean;
        icon?: string;
        text?: string;
        url?: string;
        target?: string;
        tooltip?: {
            text: string;
            position?: string;
            theme?: string;
        };
        [key: string]: any;
    };
    [key: string]: any;
};

export type LinksTreeProps = {
    uniqueId: string;
    size?: 'small' | 'large' | string;
    items: LinksTreeItem[];
    allowMultipleExpanded?: boolean;
    preExpandedIds?: string[];
    showLinks?: boolean;
    showSubLinks?: boolean;
    collapseLinksOnBlur?: boolean;
    onKeyEscape?: (e: React.KeyboardEvent<any>) => void;
    inverse?: boolean;
    [key: string]: any;
};

const TreeContext = createContext<any>(null);

const LinksTree = forwardRef<any, LinksTreeProps>((props, ref) => {
    const {
        uniqueId,
        size, 
        items: flattendItems, 
        allowMultipleExpanded, 
        preExpandedIds = [], 
        showLinks = true,
        showSubLinks, 
        collapseLinksOnBlur = false,
        onKeyEscape,
        inverse,
        ...other
    } = props
    const [expandedIds, setExpandedIds] = useState<string[]>(preExpandedIds);
    const treeRef = useRef<HTMLUListElement>(null);
    const nodeRefs = useRef<Record<string, any>>({});

    // If collapseLinksOnBlur === true, a click outside will close any expanded tree branches
    useOnClickOutside(treeRef, () => {
        if ( collapseLinksOnBlur === true ) {
            setExpandedIds([])
        }
    });

    // Allow parents to access internal state through refs
    useImperativeHandle(ref, () => ({
        getExpandedIds: () => {
            return expandedIds;
        }
    }))

    let btnSize: string | null = null;
    switch (size) {
        case "small":
            btnSize = "micro";
            break;
        case "large":
            btnSize = "jumbo";
            break;
        default:
            btnSize = "normal";
    }

    return (
        <TreeContext.Provider value={{ nodeRefs, flattendItems, expandedIds, setExpandedIds }}>
        <ul 
            id={`${uniqueId}-links`}
            className='tree c-list--ul'
            /* Chaining together two refs. 
             * Local treeRef controls the onClickOutside event and the forwarded ref 
             * is customized via useImperativeHandle to allow any parent to access the internal state */
            ref={(el)=> { 
                (treeRef as any).current = el; 
                if (ref) {
                    if (typeof ref === 'function') {
                        ref(el);
                    } else {
                        (ref as any).current = el;
                    }
                }
            }}
            {...other}
        >
           { showLinks && flattendItems.filter((x) => x.parent === null ).map(( item ) => {
                return (
                    <TreeNode
                        key={item.id} 
                        level={1} 
                        showSubLinks={showSubLinks}
                        treeKey={uniqueId}
                        onKeyEscape={onKeyEscape}
                        inverse={inverse}
                        allowMultipleExpanded={allowMultipleExpanded}
                        item={item}
                        btnSize={btnSize}
                    />
                )
                
            })}
        </ul>
        </TreeContext.Provider>
    );
});

LinksTree.displayName = 'LinksTree';

export default LinksTree;

const TreeNode = ({
    level,
    treeKey,
    parent = null,
    showSubLinks = true,
    onKeyEscape, 
    allowMultipleExpanded,
    item,
    btnSize,
    inverse
}: {
    level: number;
    treeKey: string;
    parent?: string | null;
    showSubLinks?: boolean;
    onKeyEscape?: (e: React.KeyboardEvent<any>) => void;
    allowMultipleExpanded?: boolean;
    item: LinksTreeItem;
    btnSize: string | null;
    inverse?: boolean;
}) => {

    if (showSubLinks === true && item.children.length > 0) {
        return (
            <li className="tree-branch-wrapper" >
                <Branch 
                    treeKey={treeKey}
                    parent={parent}
                    level={level} 
                    item={item}
                    onKeyEscape={onKeyEscape}
                    allowMultipleExpanded={allowMultipleExpanded}
                    inverse={inverse}
                />
            </li>
        )
    } 

    return (
        <li className="tree-leaf-list-item" >
            <div className="c-list__item">
                <Leaf  
                    id={item.id}
                    level={level} 
                    onKeyDown={onKeyEscape}
                    inverse={inverse}
                    btnSize={btnSize}
                    {...item.item} 
                />
            </div>
        </li>
    )
}

const ExpansionControls = forwardRef<any, {
    controlsId: string;
    active?: boolean;
    expandedState: boolean;
    onClick: () => void;
    onKeyDown?: (e: React.KeyboardEvent<any>) => void;
}>((props, ref) => {
    const { controlsId, active, expandedState, onClick, onKeyDown } = props 
    // https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
    return (
        <Button 
            ref={ref}
            role='button'
            aria-expanded={expandedState}
            aria-controls={controlsId}
            onClick={onClick}
            onKeyDown={onKeyDown}
        >
            <Icon 
                name={ expandedState ? 'circle-minus' : 'plus-circle'} 
                size='small' 
                theme={ active ? 'solid' : 'regular' } 
                color={ active ? 'dark-blue': 'light-blue' }
            />
        </Button>
    )
});

ExpansionControls.displayName = 'ExpansionControls';

const Branch = ({
    treeKey,
    level,
    parent = null,
    item,
    onKeyEscape,
    allowMultipleExpanded = true,
    inverse
}: {
    treeKey: string;
    level: number;
    parent?: string | null;
    item: LinksTreeItem;
    onKeyEscape?: (e: React.KeyboardEvent<any>) => void;
    allowMultipleExpanded?: boolean;
    inverse?: boolean;
}) => {
    const { nodeRefs, flattendItems, expandedIds, setExpandedIds } = useContext(TreeContext)
    const { id, item: { active } } = item
    const [expandedState, setExpandedState] = useState(expandedIds.includes(id));
    const children = flattendItems.filter((x: any) => x.parent === id)
    const controlsRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!expandedIds.includes(id)) {
            setExpandedState(false)
        }
    }, [expandedIds, id])

   
    function nodeExpansion( ) {
        const newExpandedState = !expandedState
        setExpandedState(newExpandedState)
        if ( allowMultipleExpanded === false ){
            // if parent === null, collapse all others. 
            if ( parent === null && newExpandedState === true ) {
                setExpandedIds([id])
            }
            // if current id is a child to an expanded parent, expand.
            if ( expandedIds.includes( parent ) && newExpandedState === true ) {
                setExpandedIds([...expandedIds, id])
            }
        } else {
            let copiedState = [ ...expandedIds ]
            if ( newExpandedState === true && !expandedIds.includes(id) ) {  // add branch id to the treeState
                setExpandedIds([...expandedIds, id ])
            } else if ( newExpandedState === false && expandedIds.includes(id)) {  // remove branch id to the treeState
                remove(copiedState, id )
                setExpandedIds(copiedState)
            }
        }
    }

    // If escape is pressed on a child node, close current branch and redirect focus to controls
    function onKeyEscapeChild( e: React.KeyboardEvent<any> ) {
        if ( controlsRef.current !== null && e.key === 'Escape' ) {
            setExpandedState(false)
            controlsRef.current.focus()
        }
    }

    function onKeyArrowLeftRight( e: React.KeyboardEvent<any> ) {
        switch( e.key ) {
            case 'ArrowLeft':
                if ( nodeRefs.current[id] !== null ) {
                    nodeRefs.current[id].focus()
                }
                break;
            case 'ArrowRight':
                if ( controlsRef.current !== null ) {
                    controlsRef.current.focus()
                }
                break;
        }
    }

    return (
        <>
        <div className="c-list__item">
            <Leaf 
                id={item.id}
                level={level}
                onKeyDown={(e) => {
                    if ( onKeyEscape ) {
                        onKeyEscape(e)
                    }
                    onKeyArrowLeftRight(e)
                }}
                inverse={inverse}
                {...item.item} 
            />
            <ExpansionControls
                ref={controlsRef}
                controlsId={`${treeKey}--group-${id}`} 
                active={active} 
                expandedState={expandedState}
                onClick={nodeExpansion}
                onKeyDown={onKeyArrowLeftRight}
            />
        </div>
        <ul 
            id={`${treeKey}--group-${id}`}
            role="group" 
            className={clsx(
                'tree-node-group',
                { ['tree-node-group--expanded']: expandedState === true }
            )}
        >
            {( expandedState ) && (
                children.map(( childItem: any ) => {
                    const nestedLevel = level+1
                    return (
                        <TreeNode
                            key={childItem.id}
                            parent={id}
                            level={nestedLevel} 
                            item={childItem}
                            treeKey={treeKey}
                            allowMultipleExpanded={allowMultipleExpanded}
                            onKeyEscape={onKeyEscapeChild}
                            inverse={inverse}
                        />
                    )
        
                })
            )}
        </ul>
        </>
    )
}

const Leaf = forwardRef<any, {
    className?: string;
    id: string;
    icon?: string;
    text?: string;
    url?: string;
    target?: string;
    btnSize?: string | null;
    active?: boolean;
    level: number;
    tooltip?: {
        text: string;
        position?: string;
        theme?: string;
    };
    onKeyDown?: (e: React.KeyboardEvent<any>) => void;
    inverse?: boolean;
    [key: string]: any;
}>((props, ref) => {
    const {
        className = null,
        id,
        icon,
        text,
        url,
        target,
        btnSize,
        active,
        level,
        tooltip,
        onKeyDown,
        inverse,
        ...other
    } = props

    /* Store references to every rendered leaf that the component 
     * can redirect focus with arrow keys to the next and prev nodes. */
    const { nodeRefs } = useContext(TreeContext)

    function onKeyArrowUpDown(e: React.KeyboardEvent<any>) {           
        switch(e.key) {
            case 'ArrowUp':
                const prevItems = Object.keys(nodeRefs.current).filter((x) => x < id && nodeRefs.current[x] !== null )
                const prev = prevItems[prevItems.length-1]
                if ( prev ) { nodeRefs.current[prev].focus() }
                break;
            case 'ArrowDown':
                const nextItems = Object.keys(nodeRefs.current).filter((x) => x > id && nodeRefs.current[x] !== null )
                const next = nextItems[0]
                if ( next ) { nodeRefs.current[next].focus() }
                break;
        }
    }

    const renderLeaf = () => {
        return (
            <Button
                {...other}
                layout="block"
                ref={(el: any) => { 
                    nodeRefs.current[id] = el; 
                    if (ref) {
                        if (typeof ref === 'function') {
                            ref(el);
                        } else {
                            (ref as any).current = el;
                        }
                    }
                }}
                className={clsx(
                    { [ "c-btn--has-icon" ]: icon && typeof icon === 'string' }
                )}
                aria-current={ active ? "page" : "false" }
                size={btnSize}
                href={url}
                target={target}
                text={text}
                active={active ? active : undefined}
                onKeyDown={(e) => {
                    if ( onKeyDown ) {
                        onKeyDown(e)
                    }
                    onKeyArrowUpDown(e)
                }}
                inverse={inverse}
            >
                { icon && typeof icon === 'string' && level == 1 && (
                    <Icon
                        name={icon}
                        size="small"
                        inverse={inverse}
                    />
                )}
            </Button>
           
        )
    }

    if ( tooltip?.text && tooltip?.text.length > 0) {
        return (
            <Tooltip 
                type='wrapper'
                position={tooltip?.position ?? 'right'}
                text={tooltip.text}
                theme={tooltip?.theme ?? 'dark'}
            >
                { renderLeaf() }
            </Tooltip>
        )
    }

    return renderLeaf()
   
});

Leaf.displayName = 'Leaf';

function remove ( array: any[], value: any ) {
    const index = array.indexOf(value);
    if (index > -1) { // only splice array when item is found
        array.splice(index, 1); // 2nd parameter means remove one item only
    }
}