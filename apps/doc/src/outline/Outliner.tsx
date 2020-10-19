import * as React from 'react';
import { useDocViewerStore } from '../DocViewerStore';
import { useOutlinerStore, useOutlinerCallbacks, OutlinerStoreProviderDelegate } from './OutlinerStore';
import TreeView from '@material-ui/lab/TreeView';
import { IOutlineItem } from './IOutlineItem';
import TreeItem from '@material-ui/lab/TreeItem';

const NoOutlineAvailable = React.memo(() => {

    return (
        <h2>This document does not provide an outline.</h2>
    );

});

const OutlineTreeView = React.memo(() => {

    const {outline} = useDocViewerStore(['outline']);
    const {selected, expanded} = useOutlinerStore(['selected', 'expanded']);
    const {toggleExpanded, selectRow, collapseNode, expandNode} = useOutlinerCallbacks();

    if (! outline) {
        return (
            <NoOutlineAvailable/>
        );
    }

    const toTreeItem = React.useCallback((item: IOutlineItem) => {

        return (
            <TreeItem key={item.id}
                      nodeId={item.id}
                      label={item.title}
                      TransitionProps={{timeout: 75}}>

            </TreeItem>
            //
            // <MUITreeItem nodeId={item.id}
            //              label={item.title}
            //              selected={selected}
            //              onNodeExpand={expandNode}
            //              onNodeCollapse={collapseNode}
            //              selectRow={selectRow}
            //              childNodes={props.root.children}
            //              onDrop={NULL_FUNCTION}/>
        );

    }, []);

    return (

        <TreeView selected={[...selected]}
                  expanded={[...expanded]}>

            {outline.items.map(toTreeItem)}

        </TreeView>

        // <MUITreeView root={foldersRoot}
        //              toggleExpanded={toggleExpanded}
        //              collapseNode={collapseNode}
        //              expandNode={expandNode}
        //              selectRow={selectRow}
        //              selected={selected}
        //              expanded={expanded}
        //              onDrop={NULL_FUNCTION}
        // />
    );

});


export const Outliner = React.memo(() => {

    return (
        <OutlinerStoreProviderDelegate>
            <OutlineTreeView/>
        </OutlinerStoreProviderDelegate>
    );

});

