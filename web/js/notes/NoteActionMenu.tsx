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
import {NoteActionSelections} from "./NoteActionSelections";

export interface ICommand {

    /**
     * Handle the action with the following types:
     *
     * replace: replace the text in the editor with the selected action text.
     *
     */
    readonly type: 'replace';

}

export interface IActionMenuItem {

    /**
     * A unique id for the action so that we can handle it on the callback.
     */
    readonly id: string;
    readonly text: string;
    readonly action: (id: NoteIDStr, editor: ckeditor5.IEditor) => ICommand | undefined;

}

export interface IActionMenuPosition {
    readonly top: number;
    readonly left: number;
}

export type TriggerStr = string[1] | string[2];

/**
 * Provide a list of action items we should execute and provide a prompt to
 * filter the results such that the set of actions is applicable to the prompt.
 */
export type ActionMenuItemProvider = (prompt: string) => ReadonlyArray<IActionMenuItem>;

interface IProps {

    readonly id: NoteIDStr;

    /**
     * The trigger string (may be 1 or two characters in length);
     */
    readonly trigger: TriggerStr;

    /**
     * A provider for resolving the items that the user can select form their input.
     */
    readonly itemsProvider: ActionMenuItemProvider;

    readonly children: JSX.Element;

}


// TODO: do not compute a prompt if the prev or next characters are non spaces

export const NoteActionMenu = deepMemo(function NoteActionMenu(props: IProps) {

    const {itemsProvider, trigger} = props;

    const triggerHandler = React.useMemo(() => createTriggerHandler(trigger), [trigger]);

    const [menuPosition, setMenuPosition, menuPositionRef] = useStateRef<IActionMenuPosition | undefined>(undefined);
    const [, setMenuIndex, menuIndexRef] = useStateRef<number | undefined>(undefined);

    const editorPositionRef = React.useRef<ckeditor5.IPosition | undefined>(undefined);
    const promptPositionRef = React.useRef<ckeditor5.IPosition | undefined>(undefined);

    const [prompt, setPrompt, promptRef] = useStateRef<string | undefined>(undefined);
    const promptStartRef = React.useRef<number | undefined>();

    const editor = useEditorStore();
    const editorRef = useRefValue(editor);

    const items = React.useMemo(() => itemsProvider(prompt || ''), [itemsProvider, prompt]);
    const itemsRef = useRefValue(items);

    const reset = React.useCallback(() => {
        setMenuPosition(undefined);
        setMenuIndex(undefined);
        promptStartRef.current = undefined;
        setPrompt(undefined);
        promptPositionRef.current = undefined;
    }, [setMenuIndex, setMenuPosition, setPrompt]);

    const removeEditorPromptText = React.useCallback(() => {

        const editor = editorRef.current;

        if (! editor) {
            console.warn("No editor");
            return;
        }

        editor.model.change((writer) => {

            if ( ! promptPositionRef.current) {
                console.log("No start position");
                return;
            }

            const startPosition = editor.model.createPositionAt(promptPositionRef.current, 'before');
            // const startPosition = editor.model.createPositionBefore(promptPositionRef.current);

            const endPosition = editorRef.current?.model.document.selection.getFirstPosition() || undefined;
            // const endPosition = editorPositionRef.current;

            if (! endPosition) {
                console.log("No end position");
                return;
            }

            const range = writer.createRange(startPosition, endPosition);
            writer.remove(range);

        })

    }, [editorRef]);

    const getEditorPromptText = React.useCallback(() => {

        const editor = editorRef.current;

        if (! editor) {
            console.warn("No editor");
            return;
        }

        // editor.model.document.selection.

    }, [editorRef]);

    const getEditorPosition = React.useCallback(() => {

        return editorRef.current?.model.document.selection.getFirstPosition() || undefined;

    }, [editorRef]);

    const captureEditorPosition = React.useCallback(() => {

        editorPositionRef.current = getEditorPosition();

    }, [getEditorPosition]);

    const insertEditorPromptText = React.useCallback((text: string) => {

        const editor = editorRef.current;

        if (! editor) {
            console.warn("No editor");
            return;
        }

        editor.model.change((writer) => {
            if (promptPositionRef.current) {
                writer.insertText(text, {linkHref: `#${text}`}, promptPositionRef.current);

                const currentPosition = getEditorPosition();

                if (currentPosition) {
                    writer.insertText(' ', {}, currentPosition);
                }

            }
        })

    }, [editorRef, getEditorPosition]);

    const handleSelectedActionItem = React.useCallback(() => {

        if (menuIndexRef.current !== undefined) {

            const selectedItem = itemsRef.current[menuIndexRef.current];

            if (editorRef.current) {

                try {

                    console.log("Executing item: " + selectedItem.text);
                    const command = selectedItem.action(props.id, editorRef.current);

                    removeEditorPromptText();

                    if (command?.type === 'replace') {
                        insertEditorPromptText(selectedItem.text);
                    }

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

    }, [editorRef, insertEditorPromptText, itemsRef, menuIndexRef,
        props.id, removeEditorPromptText, setMenuIndex, setMenuPosition])

    const onClick = React.useCallback(() => {
        captureEditorPosition();
    }, [captureEditorPosition]);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        if (triggerHandler(event)) {

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

                    promptPositionRef.current = editorPositionRef.current

                }

            }

        } else if (event.key === 'enter') {
            // just called when the user selects the current item.
            return;
        } else {

            if (promptStartRef.current !== undefined) {
                const prompt = NoteActionSelections.computePromptFromSelection(promptStartRef.current);
                setPrompt(prompt);
            }

        }

        // always record the editor position each time we type a character.
        captureEditorPosition()

    }, [captureEditorPosition, setMenuPosition, setPrompt, triggerHandler]);

    const computeNextMenuID = React.useCallback(() => {

        if (menuIndexRef.current === undefined) {
            return 0;
        }

        return Math.min(itemsRef.current.length - 1, menuIndexRef.current + 1);

    }, [itemsRef, menuIndexRef]);

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
             style={{
                 flexGrow: 1
             }}
             onKeyDown={onKeyDown}
             onKeyUp={onKeyDown}
             onKeyPress={onKeyDown}
             onClick={onClick}>

            {menuPosition && (
                <ClickAwayListener onClickAway={() => setMenuPosition(undefined)}>

                    <Paper elevation={3}
                           style={{
                               position: 'absolute',
                               top: menuPosition.top,
                               left: menuPosition.left
                           }}>

                        <MenuList>
                            {items.map((current, idx) => (
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

function createTriggerHandler(trigger: TriggerStr) {

    let last: string | undefined;

    return (event: React.KeyboardEvent): boolean => {

        try {

            switch (trigger.length) {
                case 1:
                    return event.key === trigger[0];

                case 2:
                    return last === trigger[0] && event.key === trigger[1];
            }

        } finally {
            last = event.key;
        }

        return false;

    }

}