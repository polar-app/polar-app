import React from 'react';
import {createStyles, makeStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import {MUITreeItem} from './MUITreeItem';
import {TagNode} from "../../../js/tags/TagNode";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";

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
}

export const MUITreeView = (props: IProps) => {

    const classes = useStyles();

    const [selected, setSelected] = React.useState<NodeID[]>([]);
    const [expanded, setExpanded] = React.useState<NodeID[]>([]);

    const onNodeExpand = (node: NodeID) => {
        const newExpanded = [...expanded, node];
        setExpanded(newExpanded);
    };

    const onNodeCollapse = (node: NodeID) => {
        const newExpanded = expanded.filter(current => current !== node);
        setExpanded(newExpanded);
    };

    const onNodeSelectToggle = (node: NodeID, type: NodeSelectToggleType) => {

        const isSelected = selected.includes(node);

        const toggleCheckbox = () => {

            if (isSelected) {
                const newSelected = selected.filter(current => node !== current)
                setSelected(newSelected);
            } else {
                const newSelected = [...selected, node];
                setSelected(newSelected);
            }

        };

        const toggleClick = () => {

            if (isSelected && selected.length === 1) {
                setSelected([]);
            } else {
                const newSelected = [node];
                setSelected(newSelected);
            }

        };

        switch (type) {
            case "click":
                toggleClick();
                break;
            case "checkbox":
                toggleCheckbox();
                break;
        }

    };

    // FIXME: should be toggleSelected

    const itemProps = {
        onNodeExpand,
        onNodeCollapse,
        onNodeSelectToggle
    };

    const {root} = props;

    return (
        <TreeView
            multiSelect
            className={classes.root}
            defaultExpanded={['1']}

            selected={selected}
            expanded={expanded}
            >
            <MUITreeItem {...itemProps}
                         nodeId={root.id}
                         selected={selected.includes(root.id)}
                         label={root.value.label}
                         info={root.count}>

                {root.children.map((child) => (
                    <MUITreeItem {...itemProps}
                                 nodeId={child.id}
                                 selected={selected.includes(child.id)}
                                 label={child.value.label}
                                 info={child.count}/>
                ))}

                {/*<MUITreeItem {...itemProps} nodeId="2" selected={selected.includes("2")} label="Hello" info={245}/>*/}
                {/*<MUITreeItem {...itemProps} nodeId="3" selected={selected.includes("3")} label="Subtree with children" info={442}>*/}
                {/*    <MUITreeItem {...itemProps} nodeId="6" selected={selected.includes("6")} label="Hello" info={153}/>*/}
                {/*    <MUITreeItem {...itemProps} nodeId="7" selected={selected.includes("7")} label="World" info={124}/>*/}
                {/*</MUITreeItem>*/}
            </MUITreeItem>

            {/*<MUITreeItem nodeId="1" label="Main" info={123}>*/}
            {/*    <MUITreeItem nodeId="2" label="Hello" info={245}/>*/}
            {/*    <MUITreeItem nodeId="3" label="Subtree with children" info={442}>*/}
            {/*        <MUITreeItem nodeId="6" label="Hello" info={153}/>*/}
            {/*        <MUITreeItem nodeId="7" label="Sub-subtree with children" info={124}/>*/}
            {/*    </MUITreeItem>*/}
            {/*</MUITreeItem>*/}

        </TreeView>
    );
}
