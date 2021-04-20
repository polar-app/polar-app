import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from 'clsx';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            // '& a[href^="#"]::before': {
            //     content: "'[['",
            //     color: theme.palette.text.disabled,
            //     userSelect: 'none'
            // },
            //
            // '& a[href^="#"]::after': {
            //     content: "']]'",
            //     color: theme.palette.text.disabled,
            //     userSelect: 'none'
            // },
            "& a": {
                cursor: 'hand'
            },
            "& a:not([href^=http])": {
                textDecorationStyle: 'dotted',
                textUnderlinePosition: 'under'

            },
            "& h1, h2, h3, h4, h5": {
                lineHeight: 0
            },
            flexGrow: 1
        }

    }),
);

interface IProps {
    readonly style?: React.CSSProperties;
    readonly className?: string;
    readonly children: React.ReactNode;
}

export const NoteStyle = deepMemo(function NoteStyle(props: IProps) {

    const classes = useStyles();

    return (
        <div className={clsx(classes.root, props.className, 'NoteStyle')}
             style={props.style}>

            {props.children}

        </div>
    )

});
