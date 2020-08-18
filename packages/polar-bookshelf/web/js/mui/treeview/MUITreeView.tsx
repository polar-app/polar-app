import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import {TagNode} from "../../tags/TagNode";
import {MUITreeItem} from "./MUITreeItem";
import {TagDescriptorSelected} from "../../../../apps/repository/js/folder_sidebar/FolderSidebarStore";
import {Tags} from "polar-shared/src/tags/Tags";
import {memoForwardRef} from "../../react/ReactUtils";
import TagID = Tags.TagID;

interface IProps {
    readonly root: TagNode<TagDescriptorSelected>;
    readonly toggleExpanded: (nodes: ReadonlyArray<string>) => void;
    readonly selectRow: (node: TagID, event: React.MouseEvent, source: 'checkbox' | 'click') => void;

    readonly collapseNode: (node: string) => void;
    readonly expandNode: (node: string) => void;

    readonly selected: ReadonlyArray<string>;
    readonly expanded: ReadonlyArray<string>;
    readonly onDrop: (tagID: TagID) => void;

}

export const MUITreeView = memoForwardRef((props: IProps) => {

    return (
        <TreeView
                  selected={[]}
                  expanded={[...props.expanded]}>

            <MUITreeItem nodeId={props.root.id}
                         label="Folders"
                         info={props.root.value.count}
                         selected={props.root.value.selected}
                         onNodeExpand={props.expandNode}
                         onNodeCollapse={props.collapseNode}
                         selectRow={props.selectRow}
                         childNodes={props.root.children}
                         onDrop={props.onDrop}/>

        </TreeView>
    );

});
