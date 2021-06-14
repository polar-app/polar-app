import createStyles from '@material-ui/core/styles/createStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexGrow: 1,
            fontSize: '18px',
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            marginBottom: theme.spacing(2),
            overflow: 'auto'
        },
    }),
);

const FixedWidthContainer = React.memo(function FixedWidthContainer(props: {children: JSX.Element}) {

    return (
        <div className="FixedWidthContainer"
             style={{
                 maxWidth: '100%',
                 flexGrow: 1,
                 marginLeft: 'auto',
                 marginRight: 'auto'
             }}>
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
