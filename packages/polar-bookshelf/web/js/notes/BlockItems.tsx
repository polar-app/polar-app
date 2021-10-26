import React from "react";
import {Theme} from "@material-ui/core";
import {deepMemo} from "../react/ReactUtils";
import {Block} from "./Block";
import {UL} from "./UL";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";
import {BlockIDStr, IBlock} from "polar-blocks/src/blocks/IBlock";

interface IBlockItemsStylesProps {
    readonly indent: boolean;
}

const useStyles = makeStyles<Theme, IBlockItemsStylesProps>(() =>
    createStyles({
        root(props) {
            return {
                flexGrow: 1,
                padding: props.indent ? undefined : 0,
            };
        },
    }),
);

interface NotesProps {
    readonly parent: BlockIDStr;
    readonly notes: ReadonlyArray<IBlock> | undefined;
    readonly indent?: boolean;
}

export const BlockItems = deepMemo(function NoteItems(props: NotesProps) {
    const {notes, parent, indent = true} = props;
    const classes = useStyles({ indent });

    if (! notes) {
        return null;
    }

    return (

        <UL className={clsx(classes.root, 'NoteItems')}>
            <>
                {notes.map((note) => {

                    // WARN: do not use id + updated because this will cause the
                    // components to constantly unmount
                    const key = note.id;

                    return (
                        <Block key={key}
                               parent={parent}
                               id={note.id}/>);
                })}
            </>
        </UL>

    );

});

