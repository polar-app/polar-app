import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import clsx from 'clsx';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: '1.5em'
        },
    }),
);

interface IProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly children: JSX.Element;
}

export const UL = deepMemo(function UL(props: IProps) {
    const classes = useStyles();

    return (
        <div className={clsx(props.className, classes.root, 'UL')}
             style={props.style}>
            {props.children}
        </div>
    )
});
