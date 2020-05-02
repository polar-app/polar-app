import TreeItem from "@material-ui/lab/TreeItem";
import React from "react";
import {NodeSelectToggleType} from "./MUITreeView";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {TNode} from "../../../js/ui/tree/TreeView";
import {CollapseIcon, ExpandIcon, MinusSquare} from "./MUITreeIcons";
import {PlusSquare} from "../treeview/MUITreeIcons";
import isEqual from "react-fast-compare";
import {createStyles, fade, makeStyles, Theme} from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import {MUITreeItemLabel} from "./MUITreeItemLabel";

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

    readonly onNodeExpand: (node: string) => void;
    readonly onNodeCollapse: (node: string) => void;
    readonly onNodeSelectToggle: (node: string, type: NodeSelectToggleType) => void;
    readonly childNodes: ReadonlyArray<TNode<TagDescriptor>>;

}

const StyledTreeItem = withStyles((theme: Theme) =>
    createStyles({
        iconContainer: {
            '& .close': {
                opacity: 0.3,
            },
        },
        group: {
            // marginLeft: 7,
            // paddingLeft: 18,
            borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
        },
    }),
)((props: IProps) => <TreeItem {...props}  />)

export const MUITreeItem = React.memo((props: IProps) => {

    const classes = useStyles();

    return (
        <TreeItem nodeId={props.nodeId}
                        label={<MUITreeItemLabel onNodeSelectToggle={props.onNodeSelectToggle}
                                                 nodeId={props.nodeId}
                                                 selected={true}
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
                                     childNodes={child.children}
                                     onNodeExpand={props.onNodeExpand}
                                     onNodeCollapse={props.onNodeCollapse}
                                     onNodeSelectToggle={props.onNodeSelectToggle}
                                     />
                    );
                }
            )}
        </TreeItem>
    )
}, isEqual);
