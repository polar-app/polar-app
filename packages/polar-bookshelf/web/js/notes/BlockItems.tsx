import React from "react";
import {Theme} from "@material-ui/core";
import {deepMemo} from "../react/ReactUtils";
import {Block} from "./Block";
import {UL} from "./UL";
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";

interface IBlockItemsStylesProps {
    indent: boolean;
}

const useStyles = makeStyles<Theme, IBlockItemsStylesProps>(() =>
    createStyles({
        root: ({ indent }) => ({
            flexGrow: 1,
            paddingLeft: indent ? 18 : 0,
        }),
    }),
);

interface NotesProps {
    readonly parent: BlockIDStr;
    readonly blockIDs: ReadonlyArray<BlockIDStr>;
    readonly indent?: boolean;
    readonly hasGutter?: boolean;
}

export const BlockItems = deepMemo(function NoteItems(props: NotesProps) {
    const { blockIDs, parent, indent = true, hasGutter = false } = props;
    const classes = useStyles({ indent });

    if (blockIDs.length === 0) {
        return null;
    }

    return (

        <UL className={clsx(classes.root, 'NoteItems')}>
            <>
                {blockIDs.map((id) => (
                    <Block key={id}
                           hasGutter={hasGutter}
                           parent={parent}
                           id={id} />)
                )}
            </>
        </UL>

    );

});

