import TreeView from "@material-ui/lab/TreeView";
import {MUITreeItem} from "./MUITreeItem";
import React from "react";
import TreeItem from "@material-ui/lab/TreeItem";

export const MUITreeViewTest = () => (
    <TreeView
        selected={[]}
        expanded={['1', '2']}
        // onNodeSelect={}
    >
        <TreeItem nodeId="1"
                  label="root">

            <TreeItem nodeId="2"
                         label="2">

                <TreeItem nodeId="3"
                             label="3"
                />

            </TreeItem>
        </TreeItem>

    </TreeView>
)
