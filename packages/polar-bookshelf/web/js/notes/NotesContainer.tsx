import {Theme} from '@material-ui/core';
import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import {Devices} from 'polar-shared/src/util/Devices';
import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";

const useContainerStyles = makeStyles(() =>
    createStyles({
        root: {
            height: '100%',
        },
    }),
);

type IUseInnerContainerStylesProps = {
    flushed: boolean;
};

const useInnerContainerStyles = makeStyles<Theme, IUseInnerContainerStylesProps>(() =>
    createStyles({
        noteContentOuter: ({ flushed }) => ({
            width: '100%',
            flex: '1 1 0',
            minHeight: 0,
            display: 'flex',
            justifyContent: 'center',
            ...(! flushed && { padding: '16px 26px' }),
        }),
    }),
);

export const NotesContainer: React.FC = deepMemo(function NotesContainer(props)  {

    const classes = useContainerStyles();

    return (
        <div className={clsx(["NotesContainer", classes.root])}>
            {props.children}
        </div>
    )

});

export const NotesInnerContainer: React.FC = ({ children }) => {

    const isHandHeld = React.useMemo(() => ! Devices.isDesktop(), []);
    const classes = useInnerContainerStyles({ flushed: isHandHeld });

    return (
        <div className={classes.noteContentOuter}>
            {children}
        </div>
    );
};
