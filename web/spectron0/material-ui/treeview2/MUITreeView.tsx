import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import {TagNode} from "../../../js/tags/TagNode";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import TreeItem from "@material-ui/lab/TreeItem";
import {MUITreeItem} from "./MUITreeItem";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

// FIXME:
// - the MUITreeItem needs to recurse itself... should not be done here.
//   use our own toggleExpanded I think..

const useStyles = makeStyles(
    createStyles({
        root: {
            // height: 264,
            // flexGrow: 1,
            // maxWidth: 1000,
        },
    }),
);

type NodeID = string;

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

export const MUITreeView = (props: IProps) => {

    const classes = useStyles();

    const itemProps = {
        onNodeExpand: props.toggleExpanded,
        onNodeCollapse: props.toggleExpanded,
        onNodeSelectToggle: props.toggleSelected
    };

    const {root} = props;

    console.log("props expanded is: ", props.expanded);

    return (
        <TreeView
            selected={[...props.selected]}
            expanded={[...props.expanded]}
            // onNodeToggle={(event, nodes) => props.toggleExpanded(nodes)}
            // expanded={["/#tags"]}
            // onNodeSelect={}
            >

            <MUITreeItem nodeId={props.root.id}
                         label={props.root.name}
                         onNodeExpand={props.expandNode}
                         onNodeCollapse={props.collapseNode}
                         onNodeSelectToggle={NULL_FUNCTION}
                         childNodes={props.root.children}/>

        </TreeView>
    );
}


// {/*<MUITreeItem {...itemProps}*/}
// {/*             key={child.id}*/}
// {/*             nodeId={child.id}*/}
// {/*             label={child.name}*/}
// {/*             info={child.count}/>*/}
