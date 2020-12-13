import * as React from 'react';
import {useDocViewerStore} from '../DocViewerStore';
import {OutlinerStoreProviderDelegate, useOutlinerStore, useOutlinerCallbacks} from './OutlinerStore';
import {IOutlineItem, OutlineLocation} from './IOutlineItem';
import {useLogger} from "../../../../web/js/mui/MUILogger";
import {IDStr} from "polar-shared/src/util/Strings";
import {deepMemo} from "../../../../web/js/react/ReactUtils";
import Box from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
        },
        folderExpandCollapse: {
            fontSize: '1.5em',
            marginLeft: '0.5em',
            cursor: 'pointer',
            color: theme.palette.text.secondary
        }
    }),
);

const NoOutlineAvailable = React.memo(() => {

    return (
        <div style={{textAlign: 'center'}}>
            <h2>No Outline Available</h2>
        </div>
    );

});

interface IProps {
    readonly item: IOutlineItem;
}

const OutlineTreeItem = deepMemo((props: IProps) => {

    const {item} = props;
    const {outlineNavigator} = useDocViewerStore(['outline', 'outlineNavigator']);
    const {expanded} = useOutlinerStore(['expanded']);
    const {toggleExpanded} = useOutlinerCallbacks();
    const log = useLogger();
    const classes = useStyles()

    const isExpanded = expanded.includes(item.id);

    const handleExpand = React.useCallback((event: React.MouseEvent, id: IDStr) => {

        event.stopPropagation();
        event.preventDefault();

        toggleExpanded([id]);

    }, [toggleExpanded]);

    const handleNavigation = React.useCallback((location: OutlineLocation | undefined) => {

        if (! location) {
            console.warn("No location");
            return;
        }

        async function doAsync() {

            if (! outlineNavigator) {
                console.warn("No outlineNavigator: ", outlineNavigator);
                return;
            }

            await outlineNavigator(location);

        }

        doAsync().catch(err => log.error(err));

    }, [log, outlineNavigator]);

    return (

        <div key={item.id}>

            <div style={{
                     fontSize: '1.25rem',
                     display: 'flex',
                     alignItems: 'center'
                 }}
                 onClick={() => handleNavigation(item.destination)}>

                <div style={{
                         flexGrow: 1,
                         cursor: 'pointer',
                         overflow: 'hidden',
                         whiteSpace: 'nowrap',
                         textOverflow: 'ellipsis',
                     }}>
                    {item.title}
                </div>

                {item.children.length > 0 && (
                    <>
                        {! isExpanded && (
                            <ExpandMoreIcon onClick={(event) => handleExpand(event, item.id)}
                                            className={classes.folderExpandCollapse}/>)}

                        {isExpanded && (
                            <ExpandLessIcon onClick={(event) => handleExpand(event, item.id)}
                                            className={classes.folderExpandCollapse}/>)}

                    </>
                )}

            </div>

            {isExpanded && (
                <div style={{marginLeft: '1.25rem'}}>

                    {item.children.map(item => (
                        <OutlineTreeItem item={item}/>
                    ))}

                </div>
            )}

        </div>
    )

});

const OutlineTreeView = React.memo(() => {

    const {outline} = useDocViewerStore(['outline']);

    if (! outline) {
        return (
            <NoOutlineAvailable/>
        );
    }

    return (

        <Box m={1}>
            {outline.items.map(item => (
                <OutlineTreeItem item={item}/>
            ))}
        </Box>
    );

});


export const Outliner = React.memo(() => {

    return (
        <OutlinerStoreProviderDelegate>
            <OutlineTreeView/>
        </OutlinerStoreProviderDelegate>
    );

});

