import * as React from 'react';
import {useDocViewerStore} from '../DocViewerStore';
import {OutlinerStoreProviderDelegate} from './OutlinerStore';
import {IOutlineItem, OutlineLocation} from './IOutlineItem';

const NoOutlineAvailable = React.memo(() => {

    return (
        <h2>This document does not provide an outline.</h2>
    );

});

const OutlineTreeView = React.memo(() => {

    const {outline, outlineNavigator} = useDocViewerStore(['outline', 'outlineNavigator']);

    const handleNavigation = React.useCallback((location: OutlineLocation | undefined) => {

        if (! outlineNavigator) {
            console.warn("No outlineNavigator: ", outlineNavigator);
            return;
        }

        if (! location) {
            console.warn("No location");
            return;
        }

        outlineNavigator(location);

    }, [outlineNavigator]);

    const toTreeItem = React.useCallback((item: IOutlineItem) => {

        return (

            <div key={item.id}
                 style={{
                     fontSize: '1.25rem',
                     cursor: 'pointer',
                     overflow: 'hidden',
                     whiteSpace: 'nowrap',
                     textOverflow: 'ellipsis'
                 }}
                 onClick={() => handleNavigation(item.destination)}>

                {item.title}

                <div style={{marginLeft: '1.25rem'}}>
                    {item.children.map(toTreeItem)}
                </div>

            </div>

        );

    }, [handleNavigation]);

    if (! outline) {
        return (
            <NoOutlineAvailable/>
        );
    }

    return (

        <div style={{margin: '1rem'}}>
            {outline.items.map(toTreeItem)}
        </div>
    );

});


export const Outliner = React.memo(() => {

    return (
        <OutlinerStoreProviderDelegate>
            <OutlineTreeView/>
        </OutlinerStoreProviderDelegate>
    );

});

