import React from "react";
import {deepMemo} from "../react/ReactUtils";
import { Block } from "./Block";
import {UL} from "./UL";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";
import {BlockIDStr} from "./store/BlocksStore";
import {IBlock} from "./store/IBlock";

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            // borderLeft: `1px solid ${theme.palette.divider}`
        },
    }),
);

interface NotesProps {
    readonly parent: BlockIDStr;
    readonly notes: ReadonlyArray<IBlock> | undefined;
}

export const BlockItems = deepMemo(function NoteItems(props: NotesProps) {

    const classes = useStyles();

    if ( ! props.notes) {
        return null;
    }

    return (

        <UL className={clsx(classes.root, 'NoteItems')}>
            <>
                {props.notes.map((note) => {

                    // WARN: do not use id + updated because this will cause the
                    // components to constantly unmount
                    const key = note.id;

                    return (
                        <Block key={key}
                               parent={props.parent}
                               id={note.id}/>);
                })}
            </>
        </UL>

    );

});

