import * as React from "react";
import {BlockIDStr} from "./store/BlocksStore";
import {NoteLink} from "./NoteLink";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '30ch',
            color: theme.palette.text.secondary,
            fontSize: '0.8em',
            "& a:link": {
                textDecoration: 'none'
            },
            "& a:visited": {
                textDecoration: 'none'
            },
            "& a:hover": {
                textDecoration: 'none'
            },
            "& a:active": {
                textDecoration: 'none'
            },
        },
    }),
);

interface IProps {
    readonly id: BlockIDStr;
    readonly content: string;
}

export const NoteBreadcrumbLink = React.memo(function NoteBreadcrumbLink(props: IProps) {

    const {content} = props;
    const classes = useStyles();

    return (
        <NoteLink target={props.id}
                  className={classes.root}>

            {content}

        </NoteLink>
    );
});
