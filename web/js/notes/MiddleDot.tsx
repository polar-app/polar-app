import * as React from 'react';
import {deepMemo} from "../react/ReactUtils";
import makeStyles from '@material-ui/core/styles/makeStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            userSelect: 'none'
        },
    }),
);

interface IProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export const MiddleDot = deepMemo((props: IProps) => {

    const classes = useStyles();

    return (
        <div className={clsx(props.className, classes.root)}
             style={props.style}>
            &#x2022;
        </div>
    )
});

MiddleDot.displayName='MiddleDot';