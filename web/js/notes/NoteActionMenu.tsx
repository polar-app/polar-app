import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import {useRefValue, useStateRef} from "../hooks/ReactHooks";
import { deepMemo } from "../react/ReactUtils";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {useEditorStore} from "./EditorStoreProvider";
import {ckeditor5} from "../../../apps/stories/impl/ckeditor5/CKEditor5BalloonEditor";
import { NoteIDStr } from "./NotesStore";
import {NoteActions} from "./NoteActions";
import {NoteActionSelections} from "./NoteActionSelections";

export interface IActionMenuItem {

    /**
     * A unique id for the action so that we can handle it on the callback.
     */
    readonly id: string;
    readonly text: string;
    readonly action: (id: NoteIDStr, editor: ckeditor5.IEditor) => void;

}

export interface IActionMenuPosition {
    readonly top: number;
    readonly left: number;
}

/**
 * Provide a list of action items we should execute and provide a prompt to
 * filter the results such that the set of actions is applicable to the prompt.
 */
export type ActionMenuItemProvider = (prompt: string) => ReadonlyArray<IActionMenuItem>;

interface IProps {

    readonly id: NoteIDStr;

    /**
     * A provider for resolving the items that the user can select form their input.
     */
    readonly itemsProvider: ActionMenuItemProvider;

    readonly children: JSX.Element;

}



// TODO: replace the text after we type it
// TODO: do not compute a prompt if the prev or next characters are non spaces

export const NoteActionMenu = deepMemo((props: IProps) => {

    const [menuPosition, setMenuPosition, menuPositionRef] = useStateRef<IActionMenuPosition | undefined>(undefined);
    const [, setMenuIndex, menuIndexRef] = useStateRef<number | undefined>(undefined);

    const [prompt, setPrompt, promptRef] = useStateRef<string | undefined>(undefined);
    const promptStartRef = React.useRef<number | undefined>();

    const editor = useEditorStore();
    const editorRef = useRefValue(editor);

    const items = props.itemsProvider("");

    const reset = React.useCallback(() => {
        setMenuPosition(undefined);
        setMenuIndex(undefined);
        promptStartRef.current = undefined;
        setPrompt(undefined);
    }, [setMenuIndex, setMenuPosition, setPrompt]);

    const promptFilterPredicate = React.useCallback((item: IActionMenuItem) => {
        return prompt === undefined || item.text.toLowerCase().indexOf(prompt.toLowerCase()) !== -1;
    }, [prompt]);

    const itemsFilteredByPrompt = React.useMemo(() => items.filter(promptFilterPredicate), [items, promptFilterPredicate]);

    const itemsFilteredByPromptRef = useRefValue(itemsFilteredByPrompt);

    const handleSelectedActionItem = React.useCallback(() => {

        if (menuIndexRef.current !== undefined) {

            const selectedItem = itemsFilteredByPromptRef.current[menuIndexRef.current];

            if (editorRef.current) {

                try {
                    console.log("Executing item: " + selectedItem.text);
                    selectedItem.action(props.id, editorRef.current);
                } catch (err) {
                    console.error("Unable to execute command: ", err);
                }

            } else {
                console.log("no editor");
            }

        } else {
            console.log("No menuIndexRef")
        }

        setMenuIndex(undefined);
        setMenuPosition(undefined);

    }, [editorRef, itemsFilteredByPromptRef, menuIndexRef, props.id, setMenuIndex, setMenuPosition])

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        switch (event.key) {

            case '/':

                const cursorRange = NoteActionSelections.computeCursorRange();

                if (cursorRange && NoteActionSelections.hasActivePrompt(cursorRange)) {

                    promptStartRef.current = cursorRange.startOffset;

                    const bcr = cursorRange.getBoundingClientRect();

                    const newPosition = {
                        top: bcr.bottom,
                        left: bcr.left,
                    };

                    if (newPosition.top !== 0 && newPosition.left !== 0) {
                        setMenuPosition(newPosition);
                    }

                }

                break;

            case 'Enter':
                // just called when the user selects the current item.
                break;

            default:

                if (promptStartRef.current !== undefined) {
                    const prompt = NoteActionSelections.computePromptFromSelection(promptStartRef.current);
                    setPrompt(prompt);
                }

                break;

        }

    }, [setMenuPosition, setPrompt]);

    const computeNextMenuID = React.useCallback(() => {

        if (menuIndexRef.current === undefined) {
            return 0;
        }

        return Math.min(itemsFilteredByPromptRef.current.length - 1, menuIndexRef.current + 1);

    }, [itemsFilteredByPromptRef, menuIndexRef]);

    const computePrevMenuID = React.useCallback(() => {

        if (menuIndexRef.current === undefined) {
            return 0;
        }

        return Math.max(0, menuIndexRef.current - 1);

    }, [menuIndexRef]);

    const onKeyDownCapture = React.useCallback((event: KeyboardEvent) => {

        if (menuPositionRef.current === undefined) {
            // the menu is not active
            return;
        }

        switch (event.key) {

            case 'Escape':
            case 'Backspace':
            case 'Delete':
            case 'ArrowLeft':
            case 'ArrowRight':
            case ' ':
                reset();
                break;

            case 'ArrowDown':

                const nextID = computeNextMenuID();
                setMenuIndex(nextID);
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'ArrowUp':

                const prevID = computePrevMenuID();
                setMenuIndex(prevID);
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'Enter':

                handleSelectedActionItem();

                event.preventDefault();
                event.stopPropagation();
                break;

            default:
                break;
        }

    }, [computeNextMenuID, computePrevMenuID, handleSelectedActionItem, menuPositionRef, reset, setMenuIndex]);

    useComponentDidMount(() => {
        document.addEventListener('keydown', event => onKeyDownCapture(event), {capture: true});
    })

    useComponentWillUnmount(() => {
        document.removeEventListener('keydown', event => onKeyDownCapture(event), {capture: true});
    })


    interface NoteMenuItemProps extends IActionMenuItem {
        readonly menuID: number;
    }

    const NoteMenuItem = React.memo((props: NoteMenuItemProps) => {

        const {menuID} = props;

        return (
            <MenuItem onClick={handleSelectedActionItem}
                      selected={menuIndexRef.current === menuID}>
                <ListItemText primary={props.text} />
            </MenuItem>
        );

    });

    return (

        <div className="NoteActionMenu"
             onKeyDown={onKeyDown}
             onKeyUp={onKeyDown}
             onKeyPress={onKeyDown}>

            {menuPosition && (
                <ClickAwayListener onClickAway={() => setMenuPosition(undefined)}>

                    <Paper elevation={3}
                           style={{
                               position: 'absolute',
                               top: menuPosition.top,
                               left: menuPosition.left
                           }}>

                        <MenuList>
                            {itemsFilteredByPrompt.map((current, idx) => (
                                <NoteMenuItem key={idx}
                                              menuID={idx}
                                              {...current}/>))}
                        </MenuList>
                    </Paper>
                </ClickAwayListener>)}

            {props.children}
        </div>

    );
});
