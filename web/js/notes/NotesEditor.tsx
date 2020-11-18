import React from "react";
import {CKEditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {NoteActionMenu} from "./NoteActionMenu";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {NoteActionMenuStoreProvider, useNoteActionMenuKeyboardListener, useNoteActionMenuStoreListener} from "./NoteActionMenuStore";

interface IProps {
    readonly content: string;
}

export const Inner = React.memo((props: IProps) => {

    const {position} = useNoteActionMenuStoreListener();
    const [actionMenuOnKeyDown, actionMenuDismiss] = useNoteActionMenuKeyboardListener();

    return (
        <div onKeyDown={actionMenuOnKeyDown}>
            {position && (
                <ClickAwayListener onClickAway={actionMenuDismiss}>
                    <div>
                        <NoteActionMenu {...position}/>
                    </div>
                </ClickAwayListener>
            )}
            <CKEditor5 content={props.content} onChange={NULL_FUNCTION}/>
        </div>
    );

});

export const NoteEditor = React.memo((props: IProps) => {

    return (
        <NoteActionMenuStoreProvider initialValue={{position: undefined, menuIndex: undefined}}>
            <Inner {...props}/>
        </NoteActionMenuStoreProvider>
    );
});
