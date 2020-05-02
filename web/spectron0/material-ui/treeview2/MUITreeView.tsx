import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import {TagNode} from "../../../js/tags/TagNode";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {MUITreeItem} from "./MUITreeItem";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import isEqual from "react-fast-compare";

export type NodeSelectToggleType = 'click' | 'checkbox';

interface IProps {
    readonly root: TagNode<TagDescriptor>;
    readonly toggleExpanded: (nodes: ReadonlyArray<string>) => void;
    readonly toggleSelected: (nodes: ReadonlyArray<string>) => void;

    readonly collapseNode: (node: string) => void;
    readonly expandNode: (node: string) => void;

    readonly selected: ReadonlyArray<string>;
    readonly expanded: ReadonlyArray<string>;
}

export const MUITreeView = React.memo((props: IProps) => {

    return (
        <TreeView
            selected={[...props.selected]}
            expanded={[...props.expanded]}
            >

            <MUITreeItem nodeId={props.root.id}
                         label={props.root.name}
                         info={props.root.value.count}
                         onNodeExpand={props.expandNode}
                         onNodeCollapse={props.collapseNode}
                         onNodeSelectToggle={NULL_FUNCTION}
                         childNodes={props.root.children}/>

        </TreeView>
    );
}, isEqual);
