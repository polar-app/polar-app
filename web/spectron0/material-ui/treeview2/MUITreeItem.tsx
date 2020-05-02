import TreeItem from "@material-ui/lab/TreeItem";
import React from "react";
import {NodeSelectToggleType} from "./MUITreeView";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {TNode} from "../../../js/ui/tree/TreeView";
import {CollapseIcon, ExpandIcon} from "./MUITreeIcons";
import isEqual from "react-fast-compare";
import {createStyles, makeStyles} from "@material-ui/core/styles";
import {MUITreeItemLabel} from "./MUITreeItemLabel";
import {TagDescriptorSelected} from "../../../../apps/repository/js/folder_sidebar/FolderSidebarStore";
import {Tags} from "polar-shared/src/tags/Tags";
import TagID = Tags.TagID;
import {useCallback} from "@types/react";

const useStyles = makeStyles(
    createStyles({
        treeItem: {
            userSelect: 'none'
        },
    }),
);


interface IProps {

    readonly nodeId: string;
    readonly label: string;
    readonly info?: string | number;
    readonly selected: boolean;

    readonly onNodeExpand: (node: string) => void;
    readonly onNodeCollapse: (node: string) => void;
    readonly childNodes: ReadonlyArray<TNode<TagDescriptorSelected>>;

    readonly selectRow: (node: TagID, event: React.MouseEvent, source: 'checkbox' | 'click') => void;

}

export const MUITreeItem = React.memo((props: IProps) => {

    const classes = useStyles();

    return (
        <TreeItem nodeId={props.nodeId}
                        label={<MUITreeItemLabel selectRow={props.selectRow}
                                                 nodeId={props.nodeId}
                                                 selected={props.selected}
                                                 label={props.label}
                                                 info={props.info}/>}
                        collapseIcon={<CollapseIcon nodeId={props.nodeId} onNodeCollapse={props.onNodeCollapse} />}
                        expandIcon={<ExpandIcon nodeId={props.nodeId} onNodeExpand={props.onNodeExpand}/>}
                        TransitionProps={{timeout: 75}}
                        >

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
                                     />
                    );
                }
            )}
        </TreeItem>
    )
}, isEqual);
