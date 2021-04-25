import React from 'react';
import {useDocViewerStore} from "../../DocViewerStore";
import {memoForwardRef} from "../../../../../web/js/react/ReactUtils";
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';

interface IProps {
    readonly children: React.ReactNode;
}

const useStyles = makeStyles(() =>
    createStyles({
        container: {
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minWidth: 0,
            minHeight: 0,
            overflow: 'none',
        },
        viewerContainer: {
            position: 'absolute',
            overflow: 'none',
            top: 0,
            width: '100%',
            height: '100%'
        }
    }),
);

export const EPUBViewerContainer = memoForwardRef(function EPUBViewerContainer(props: IProps) {

    const classes = useStyles();
    const {page} = useDocViewerStore(['page']);

    return (
        <main id="viewerContainer"
              className={`${classes.container} ${classes.viewerContainer} viewerContainer`}
              itemProp="mainContentOfPage">

            <div id="viewer" className={`${classes.container} epubViewer viewer`}>
                <div data-page-number={page}
                     data-loaded="true"
                     className={`${classes.container} page`}
                     style={{
                         userSelect: 'none'
                     }}/>

                {props.children}
            </div>

        </main>
    );
})
