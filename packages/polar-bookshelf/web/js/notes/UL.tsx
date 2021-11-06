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
            paddingLeft: 18,
        },
    }),
);

interface IProps {
    readonly className?: string;
    readonly style?: React.CSSProperties;
}

export const UL: React.FC<IProps> = deepMemo(function UL(props) {
    const classes = useStyles();

    return (
        <div className={clsx(props.className, classes.root, 'UL')}
             style={props.style}>
            {props.children}
        </div>
    )
});
