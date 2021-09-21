import React from 'react';
import {deepMemo} from "../react/ReactUtils";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from 'clsx';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            fontSize: '14px',
            lineHeight: '1.5rem',
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
                cursor: 'pointer'
            },
            "& a:not([href^=http])": {
                textDecorationStyle: 'dotted',
                textUnderlinePosition: 'under',
                "&.note-tag": {
                    color: "#A7B6C2",
                }
            },
            "& img": {
                maxWidth: '100%',
                verticalAlign: 'top',
            },
            "& pre": {
                margin: 0,
            },
            height: '100%',
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
