import TreeItem from "@material-ui/lab/TreeItem";
import React, {useCallback} from "react";
import {CollapseIcon, ExpandIcon} from "./MUITreeIcons";
import isEqual from "react-fast-compare";
import {MUITreeItemLabel} from "./MUITreeItemLabel";
import {TagDescriptorSelected} from "../../../../apps/repository/js/folder_sidebar/FolderSidebarStore";
import {Tags} from "polar-shared/src/tags/Tags";
import {DragTarget2} from "../../ui/tree/DragTarget2";
import TagID = Tags.TagID;
import {TNode} from "../../ui/tree/TNode";
import {SelectRowType} from "../../../../apps/repository/js/doc_repo/SelectionEvents2";

interface IProps {

    readonly nodeId: string;
    readonly label: string;
    readonly info?: string | number;
    readonly selected: boolean;

    readonly onNodeExpand: (event: React.MouseEvent, node: string) => void;
    readonly onNodeCollapse: (node: string) => void;
    readonly childNodes: ReadonlyArray<TNode<TagDescriptorSelected>>;

    readonly selectRow: (node: TagID, event: React.MouseEvent, source: SelectRowType) => void;
    readonly onDrop: (event: React.DragEvent, tagID: TagID) => void;

}

export const MUITreeItem = React.memo(function MUITreeItem(props: IProps) {

    const onDrop = useCallback((event: React.DragEvent) => {
        props.onDrop(event, props.nodeId)
    }, [props])

    return (
        <DragTarget2 onDrop={onDrop}>
            <TreeItem nodeId={props.nodeId}
                      label={<MUITreeItemLabel selectRow={props.selectRow}
                                               nodeId={props.nodeId}
                                               selected={props.selected}
                                               label={props.label}
                                               info={props.info}/>}
                      collapseIcon={<CollapseIcon nodeId={props.nodeId} onNodeCollapse={props.onNodeCollapse} />}
                      expandIcon={<ExpandIcon nodeId={props.nodeId} onNodeExpand={props.onNodeExpand}/>}
                      TransitionProps={{timeout: 75}}>

                {props.childNodes.map((child) => {
                     return (
                            <MUITreeItem key={child.id}
                                         nodeId={child.id}
                                         label={child.name}
                                         info={child.count}
                                         selected={child.value.selected}
                                         childNodes={child.children}
                                         onNodeExpand={props.onNodeExpand}
                                         onNodeCollapse={props.onNodeCollapse}
                                         selectRow={props.selectRow}
                                         onDrop={props.onDrop}
                                         />
                        );
                    }
                )}
            </TreeItem>
        </DragTarget2>
    )
}, isEqual);
