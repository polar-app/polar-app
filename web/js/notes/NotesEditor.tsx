import React from "react";
import {CKEditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {NoteActionMenu} from "./NoteActionMenu";

interface IProps {
    readonly content: string;
}

interface IActiveMenuPosition {
    readonly top: number;
    readonly left: number;
}

type ActionMenuOnKeyDown = (event: React.KeyboardEvent) => void;
type ActionMenuTuple = [IActiveMenuPosition | undefined, ActionMenuOnKeyDown];

function useActionMenu(): ActionMenuTuple {

    const [position, setPosition] = React.useState<IActiveMenuPosition | undefined>(undefined);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        // TODO: filter the list input based on what the user has typed
        // TODO: up/down arrows to select the right item
        // TODO: click away listener so that if I select another item this will go away
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
            case 'Backspace':
            case 'Delete':
            case 'ArrowLeft':
            case 'ArrowRight':
            case ' ':
                setPosition(undefined);
                break;

        }

    }, []);

    return [position, onKeyDown]

}

export const NoteEditor = React.memo((props: IProps) => {

    const [position, onKeyDown] = useActionMenu();

    const onKeyPress = React.useCallback(() => {

    }, []);

    return (
        <div onKeyDown={onKeyDown}>
            {position && <NoteActionMenu {...position}/>}
            <CKEditor5 content={props.content} onChange={NULL_FUNCTION}/>
        </div>
    );
});
