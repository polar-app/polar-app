import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            fontSize: '18px',
            overflow: 'hidden',
            height: '100%',
        },
    }),
);

const FixedWidthContainer = React.memo(function FixedWidthContainer(props: {children: JSX.Element}) {

    return (
        <div className="FixedWidthContainer"
             style={{ height: '100%' }}>
            {props.children}
        </div>
    );

});
export const NotesContainer = deepMemo(function NotesContainer(props: {children: JSX.Element})  {

    const classes = useStyles();

    return (
        <div className={clsx(["NotesContainer", classes.root])}>

            <FixedWidthContainer>
                {props.children}
            </FixedWidthContainer>
        </div>
    )

});
