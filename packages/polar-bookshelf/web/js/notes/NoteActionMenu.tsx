import React from "react";
import {useRefValue, useStateRef} from "../hooks/ReactHooks";
import {BlockIDStr, useBlocksStore} from "./store/BlocksStore";
import { observer } from "mobx-react-lite"

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
    readonly action: (id: BlockIDStr) => ICommand | undefined;

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

    readonly id: BlockIDStr;

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

export const NoteActionMenu = observer(function NoteActionMenu(props: IProps) {

    // FIXME: can we do this ENTIRELY without ckeditor? I think we could...
    //
    // const {itemsProvider, trigger} = props;
    //
    // const triggerHandler = React.useMemo(() => createTriggerHandler(trigger), [trigger]);
    //
    // const [menuPosition, setMenuPosition, menuPositionRef] = useStateRef<IActionMenuPosition | undefined>(undefined);
    // const [, setMenuIndex, menuIndexRef] = useStateRef<number | undefined>(undefined);
    //
    // const promptPositionRef = React.useRef<ckeditor5.IPosition | undefined>(undefined);
    //
    // const [prompt, setPrompt, promptRef] = useStateRef<IPrompt | undefined>(undefined);
    // const promptStartRef = React.useRef<number | undefined>();
    //
    // const items = React.useMemo(() => itemsProvider(prompt?.prompt || ''), [itemsProvider, prompt]);
    // const itemsRef = useRefValue(items);
    // const store = useNotesStore();
    //
    // const promptManager = usePromptManager(props.trigger);
    //
    // const reset = React.useCallback(() => {
    //
    //     setMenuPosition(undefined);
    //     setMenuIndex(undefined);
    //     setPrompt(undefined);
    //
    //     promptStartRef.current = undefined;
    //     promptPositionRef.current = undefined;
    //     promptManager.reset();
    //
    // }, [promptManager, setMenuIndex, setMenuPosition, setPrompt]);

    // const removeEditorPromptText = React.useCallback(() => {
    //
    //     const editor = editorRef.current;
    //
    //     if (! editor) {
    //         console.warn("NoteActionMenu: No editor");
    //         return;
    //     }
    //
    //     editor.model.change((writer) => {
    //
    //         if ( ! promptPositionRef.current) {
    //             console.log("No start position");
    //             return;
    //         }
    //
    //         const startPosition = editor.model.createPositionAt(promptPositionRef.current, 'before');
    //         // const startPosition = editor.model.createPositionBefore(promptPositionRef.current);
    //
    //         const endPosition = editorRef.current?.model.document.selection.getFirstPosition() || undefined;
    //         // const endPosition = editorPositionRef.current;
    //
    //         if (! endPosition) {
    //             console.log("No end position");
    //             return;
    //         }
    //
    //         const range = writer.createRange(startPosition, endPosition);
    //         writer.remove(range);
    //
    //     })
    //
    // }, [editorRef]);
    //
    // const getEditorPromptText = React.useCallback(() => {
    //
    //     const editor = editorRef.current;
    //
    //     if (! editor) {
    //         console.warn("getEditorPromptText: No editor");
    //         return;
    //     }
    //
    //     // editor.model.document.selection.
    //
    // }, [editorRef]);
    //
    // const getEditorPosition = React.useCallback(() => {
    //
    //     return editorRef.current?.model.document.selection.getFirstPosition() || undefined;
    //
    // }, [editorRef]);
    //
    // const captureEditorPosition = React.useCallback(() => {
    //
    //     editorPositionRef.current = getEditorPosition();
    //
    // }, [getEditorPosition]);
    //
    //
    // const insertEditorPromptText = React.useCallback((text: string) => {
    //
    //     const editor = editorRef.current;
    //
    //     if (! editor) {
    //         console.warn("insertEditorPromptText: No editor");
    //         return;
    //     }
    //
    //     editor.model.change((writer) => {
    //         if (promptPositionRef.current) {
    //
    //             writer.insertText(text, {linkHref: `#${text}`}, promptPositionRef.current);
    //
    //             const currentPosition = getEditorPosition();
    //
    //             if (currentPosition) {
    //                 writer.insertText(' ', {}, currentPosition);
    //             }
    //
    //         }
    //     })
    //
    // }, [editorRef, getEditorPosition]);
    //
    // const handleSelectedActionItem = React.useCallback(() => {
    //
    //     if (menuIndexRef.current !== undefined) {
    //
    //         const selectedItem = itemsRef.current[menuIndexRef.current];
    //
    //         if (editorRef.current) {
    //
    //             try {
    //
    //                 console.log("Executing item: " + selectedItem.text);
    //                 const command = selectedItem.action(props.id);
    //
    //                 removeEditorPromptText();
    //
    //                 if (command?.type === 'replace') {
    //                     insertEditorPromptText(selectedItem.text);
    //                 }
    //
    //             } catch (err) {
    //                 console.error("Unable to execute command: ", err);
    //             }
    //
    //         } else {
    //             console.log("handleSelectedActionItem: No editor");
    //         }
    //
    //     } else {
    //         console.log("No menuIndexRef")
    //     }
    //
    //     setMenuIndex(undefined);
    //     setMenuPosition(undefined);
    //
    // }, [editorRef, insertEditorPromptText, itemsRef, menuIndexRef,
    //     props.id, removeEditorPromptText, setMenuIndex, setMenuPosition])

    // const onClick = React.useCallback(() => {
    //     captureEditorPosition();
    // }, [captureEditorPosition]);
    //
    // const computeNextMenuID = React.useCallback(() => {
    //
    //     if (menuIndexRef.current === undefined) {
    //         return 0;
    //     }
    //
    //     return Math.min(itemsRef.current.length - 1, menuIndexRef.current + 1);
    //
    // }, [itemsRef, menuIndexRef]);

    // const computePrevMenuID = React.useCallback(() => {
    //
    //     if (menuIndexRef.current === undefined) {
    //         return 0;
    //     }
    //
    //     return Math.max(0, menuIndexRef.current - 1);
    //
    // }, [menuIndexRef]);
    //
    //
    // const onKeyDown = React.useCallback((event: KeyboardEvent) => {
    //
    //     if (! store.isActive(props.id)) {
    //         return;
    //     }
    //
    //     const triggered = triggerHandler(event);
    //
    //     if (triggered) {
    //
    //         const cursorRange = NoteActionSelections.computeCursorRange();
    //
    //         if (cursorRange && NoteActionSelections.hasActivePrompt(cursorRange)) {
    //
    //             promptStartRef.current = cursorRange.startOffset;
    //
    //             const bcr = cursorRange.getBoundingClientRect();
    //
    //             const newPosition = {
    //                 top: bcr.bottom,
    //                 left: bcr.left,
    //             };
    //
    //             if (newPosition.top !== 0 && newPosition.left !== 0) {
    //
    //                 setMenuPosition(newPosition);
    //                 promptPositionRef.current = editorPositionRef.current
    //
    //             }
    //
    //         }
    //     }
    //
    //     if (menuPositionRef.current !== undefined) {
    //
    //         const prompt = promptManager.update(event);
    //         setPrompt(prompt);
    //
    //         // TEST: if the user removes the prompt by typing Backspace, the
    //         // action menu should vanish.
    //
    //         function abortEvent() {
    //             event.stopPropagation();
    //             event.preventDefault();
    //         }
    //
    //         switch (event.key) {
    //
    //             case 'Escape':
    //
    //                 reset();
    //                 abortEvent();
    //                 break;
    //
    //             case 'Backspace':
    //
    //                 if (prompt.raw === '') {
    //                     reset();
    //                 }
    //
    //                 break;
    //
    //             case 'Enter':
    //                 // execute the given command...
    //                 handleSelectedActionItem();
    //                 reset();
    //                 abortEvent();
    //                 break;
    //
    //             case 'ArrowDown':
    //
    //                 const nextID = computeNextMenuID();
    //                 setMenuIndex(nextID);
    //                 abortEvent();
    //                 break;
    //
    //             case 'ArrowUp':
    //
    //                 const prevID = computePrevMenuID();
    //                 setMenuIndex(prevID);
    //                 abortEvent();
    //                 break;
    //
    //             default:
    //                 break;
    //
    //         }
    //
    //     }
    //
    //     captureEditorPosition()
    //
    // }, [captureEditorPosition, computeNextMenuID, computePrevMenuID, handleSelectedActionItem, menuPositionRef, promptManager, props.id, reset, setMenuIndex, setMenuPosition, setPrompt, store, triggerHandler]);

    interface NoteMenuItemProps extends IActionMenuItem {
        readonly menuID: number;
    }

    const NoteActionMenuItem = React.memo(function NoteActionMenuItem(props: NoteMenuItemProps) {

        const {menuID} = props;

        // return (
        //     <MenuItem onClick={handleSelectedActionItem}
        //               selected={menuIndexRef.current === menuID}>
        //         <ListItemText primary={props.text} />
        //     </MenuItem>
        // );

        return null;

    });
    //
    // React.useEffect(() => {
    //
    //     // we hook the main window event listener because we have to override
    //     // all the key events to everything else once we are active.
    //
    //     // FIXME: I think this is activating N times not for only the currently
    //     // active note ... there probably need to be two event listeners.
    //     //
    //     // the local one which is a normal event listener and listens for key
    //     // events as part of the normal dom and then one that listens at the
    //     // window level so it an abort events.
    //
    //     window.addEventListener('keydown', onKeyDown, {capture: true})
    //
    //     return () => {
    //         window.removeEventListener('keydown', onKeyDown, {capture: true})
    //     }
    //
    // }, [onKeyDown])

    // return (
        //
        // <div className="NoteActionMenu"
        //      style={{
        //          flexGrow: 1
        //      }}
        //      onClick={onClick}>
        //
        //     {menuPosition && (
        //         <ClickAwayListener onClickAway={() => setMenuPosition(undefined)}>
        //
        //             <Paper elevation={3}
        //                    style={{
        //                        position: 'absolute',
        //                        top: menuPosition.top,
        //                        left: menuPosition.left
        //                    }}>
        //
        //                 <MenuList>
        //                     {items.map((current, idx) => (
        //                         <NoteActionMenuItem key={idx}
        //                                             menuID={idx}
        //                                             {...current}/>))}
        //                 </MenuList>
        //             </Paper>
        //         </ClickAwayListener>)}
        //
        //     {props.children}
        // </div>
    //
    //
    // );

    return props.children;

});

/**
 * The trigger handler determines when the action menu is triggered / activated
 * when the user is typing and their specific trigger string is used.
 */
function createTriggerHandler(trigger: TriggerStr) {

    let last: string | undefined;

    return (event: KeyboardEvent): boolean => {

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

interface IPrompt {

    /**
     * The RAW prompt with no trigger removal
     */
    readonly raw: string;

    /**
     * The prompt with the trigger removed.
     */
    readonly prompt: string;

}

interface PromptManager {

    readonly reset: () => void;

    /**
     * Update the prompt and return the current value.
     */
    readonly update: (event: KeyboardEvent) => IPrompt;
}

/**
 * The prompt manager takes events form the keyboard, and construct them to
 * build a snapshot of what the ckeditor text should be at the cursor prompt
 * without having to deal with ckeditor nonsense
 */
function usePromptManager(trigger: string): PromptManager {

    const promptRef = React.useRef("");

    const reset = React.useCallback(() => {
        promptRef.current = '';
    }, []);

    const update = React.useCallback((event: KeyboardEvent) => {

        switch (event.key) {

            case 'Backspace':

                if (promptRef.current !== '') {
                    // remove the last character from the prompt.
                    promptRef.current
                        = promptRef.current.substr(0, promptRef.current.length - 1);
                }

                break;

            case 'Escape':
            case 'Command':
            case 'Enter':
            case 'ArrowUp':
            case 'ArrowDown':
            case 'Shift':
                console.log("FIXME 111");
                // ignore these
                break;

            default:
                // build a new prompt by appending the text
                promptRef.current = promptRef.current + event.key;
                break;

        }

        function computeResultWithoutTrigger() {

            const start = trigger.length;

            const raw = promptRef.current;

            if (raw.length < start) {
                return {
                    raw,
                    prompt: ""
                }
            }

            const prompt = raw.substring(start);

            return {raw, prompt};

        }

        return computeResultWithoutTrigger();

    }, [trigger]);

    return React.useMemo((): PromptManager => ({reset, update}), [reset, update]);

}
