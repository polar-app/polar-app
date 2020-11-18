import React from "react";
import {CKEditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {NoteActionMenu} from "./NoteActionMenu";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

interface IProps {
    readonly content: string;
}

interface IActiveMenuPosition {
    readonly top: number;
    readonly left: number;
}

export type ActionMenuOnKeyDown = (event: React.KeyboardEvent) => void;
export type ActionMenuDismiss = () => void;
export type ActionMenuTuple = [IActiveMenuPosition | undefined, ActionMenuOnKeyDown, ActionMenuDismiss];


function useActionMenu(): ActionMenuTuple {

    const [position, setPosition] = React.useState<IActiveMenuPosition | undefined>(undefined);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        // TODO: when I hit 'enter' the action should execute and the menu should be dismissed
        // TODO: filter the list input based on what the user has typed after the /
        // TODO: we can do editing.view.focus()
        // TODO: we can call ref.focus() (on the element) to select the current items
        // and we can use that to navigate through them.
        // TODO: link to another node using completion with [[
        // TODO: link to tags too

        switch (event.key) {

            case '/':

                if (window.getSelection()?.rangeCount === 1) {

                    const bcr = window.getSelection()!.getRangeAt(0).getBoundingClientRect();

                    setPosition({
                        top: bcr.bottom,
                        left: bcr.left,
                    });

                }

                break;
            case 'Escape':
            case 'Enter':
            case 'Backspace':
            case 'Delete':
            case 'ArrowLeft':
            case 'ArrowRight':
            case ' ':
                setPosition(undefined);
                break;

        }

    }, []);

    const dismiss = React.useCallback(() => {
        setPosition(undefined)
    }, []);

    return [position, onKeyDown, dismiss]

}

export const NoteEditor = React.memo((props: IProps) => {

    const [actionMenuPosition, actionMenuOnKeyDown, actionMenuDismiss] = useActionMenu();

    return (
        <div onKeyDown={actionMenuOnKeyDown}>
            {actionMenuPosition && (
                    <ClickAwayListener onClickAway={actionMenuDismiss}>
                        <div>
                            <NoteActionMenu {...actionMenuPosition}/>
                        </div>
                    </ClickAwayListener>
                )}
            <CKEditor5 content={props.content} onChange={NULL_FUNCTION}/>
        </div>
    );
});
