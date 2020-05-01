import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import {MUITreeItem} from './MUITreeItem';
import {TagNode} from "../../../js/tags/TagNode";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import TreeItem from "@material-ui/lab/TreeItem";
import Collapse from "@material-ui/core/Collapse";

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
    readonly selected: ReadonlyArray<string>;
    readonly expanded: ReadonlyArray<string>;
}

export const MUITreeView = (props: IProps) => {

    const classes = useStyles();

    //
    // const onNodeSelectToggle = (node: NodeID, type: NodeSelectToggleType) => {
    //
    //     const isSelected = selected.includes(node);
    //
    //     const toggleCheckbox = () => {
    //
    //         if (isSelected) {
    //             const newSelected = selected.filter(current => node !== current)
    //             setSelected(newSelected);
    //         } else {
    //             const newSelected = [...selected, node];
    //             setSelected(newSelected);
    //         }
    //
    //     };
    //
    //     const toggleClick = () => {
    //
    //         if (isSelected && selected.length === 1) {
    //             setSelected([]);
    //         } else {
    //             const newSelected = [node];
    //             setSelected(newSelected);
    //         }
    //
    //     };
    //
    //     switch (type) {
    //         case "click":
    //             toggleClick();
    //             break;
    //         case "checkbox":
    //             toggleCheckbox();
    //             break;
    //     }
    //
    // };

    const itemProps = {
        onNodeExpand: props.toggleExpanded,
        onNodeCollapse: props.toggleExpanded,
        onNodeSelectToggle: props.toggleSelected
    };

    const {root} = props;

    console.log("props expanded is: ", props.expanded);

    return (
        <TreeView
            // className={classes.root}
            selected={[...props.selected]}
            expanded={[...props.expanded]}
            onNodeToggle={(event, nodes) => props.toggleExpanded(nodes)}
            // expanded={["/#tags"]}
            // onNodeSelect={}
            >
            {/*<MUITreeItem {...itemProps}*/}
            {/*             nodeId={root.id}*/}
            {/*             label={`${root.name} (${root.id})`}*/}
            {/*             info={root.count}>*/}

            <TreeItem nodeId={root.id}
                      label={`${root.name} (${root.id})`}
                      // info={root.count}
                      // TransitionComponent={<Collapse timeout={50}/>}
                      TransitionProps={{timeout: 50}}
                      >

            {root.children.map((child) => {

                    // console.log("FIXME adding child");
                    return (

                        <TreeItem key={child.id}
                                  nodeId={child.id}
                                  label={`${child.name} (${child.id})`}
                                  />
                    );
                })}
            </TreeItem>

        </TreeView>
    );
}


// {/*<MUITreeItem {...itemProps}*/}
// {/*             key={child.id}*/}
// {/*             nodeId={child.id}*/}
// {/*             label={child.name}*/}
// {/*             info={child.count}/>*/}
