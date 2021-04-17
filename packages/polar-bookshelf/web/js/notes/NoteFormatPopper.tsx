import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import React from 'react';
import {NoteFormatBar, NoteFormatBarProps} from "./NoteFormatBar";
import {useNoteFormatHandlers, useNoteFormatKeyboardHandler} from "./NoteFormatHooks";
import { observer } from "mobx-react-lite"
import {BlockIDStr, useBlocksStore } from './store/BlocksStore';

export interface INoteFormatBarPosition {

    /**
     * Where we should be placing the menu when it needs to be ABOVE the text.
     */
    readonly bottom: number;

    /**
     * Where we should be placing the menu when it needs to be BELOW the text.
     */
    readonly top: number;

    readonly left: number;

}

export interface IProps extends NoteFormatBarProps {
    readonly id: BlockIDStr;
    readonly children: JSX.Element;

    readonly onUpdated: () => void;

}

export const NoteFormatPopper = observer(function NoteFormatPopper(props: IProps) {

    const [position, setPosition] = React.useState<INoteFormatBarPosition | undefined>(undefined);
    const timeoutRef = React.useRef<number | undefined>(undefined);

    const blocksStore = useBlocksStore();

    const block = blocksStore.getBlock(props.id);
    const selected = blocksStore.selected();

    const {active} = blocksStore;

    // FIXME listen to selected in the store and if it's not empty then clear the popup..

    const doPopup = React.useCallback((): boolean => {

        if (Object.keys(selected).length > 0) {
            return false;
        }

        const range = window.getSelection()!.getRangeAt(0);

        if (range.collapsed) {

            if (position) {
                setPosition(undefined);
            }

            return false;
        }

        const bcr = range.getBoundingClientRect();

        setPosition({
            top: bcr.bottom,
            bottom: bcr.top,
            left: bcr.left
        })

        return true;

    }, [position, selected]);

    const clearPopup = React.useCallback(() => {

        setPosition(undefined);

    }, [])

    const clearPopupForKeyboard = React.useCallback(() => {

        clearPopup();

    }, [clearPopup])

    const noteFormatKeyboardHandler = useNoteFormatKeyboardHandler(block?.content.type, clearPopupForKeyboard);

    const clearPopupTimeout = React.useCallback(() => {

        if (timeoutRef.current !== undefined) {
            clearTimeout(timeoutRef.current);
        }

    }, [])

    const doPopupWithTimeout = React.useCallback(() => {

        clearPopupTimeout();

        timeoutRef.current = window.setTimeout(() => doPopup(), 350);

    }, [clearPopupTimeout, doPopup]);

    const onMouseUp = React.useCallback(() => {

        doPopupWithTimeout();

    }, [doPopupWithTimeout]);

    const onKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        if (position !== undefined) {

            if (event.key === 'Escape') {
                clearPopup();
            }

        } else {
            doPopupWithTimeout();
        }

    }, [clearPopup, doPopupWithTimeout, position]);

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {
        noteFormatKeyboardHandler(event);
    }, [noteFormatKeyboardHandler]);

    React.useEffect(() => {

        if (active?.id !== props.id) {
            clearPopup();
        }

    }, [active?.id, clearPopup, props.id]);

    React.useEffect(() => {

        // FIXME: this just isn't being fired reliably

        if (Object.keys(selected).length !== 0) {
            clearPopup();
        }

    }, [clearPopup, selected]);

    const noteFormatHandlers = useNoteFormatHandlers(block?.content.type, props.onUpdated);

    return (
        <ClickAwayListener onClickAway={() => setPosition(undefined)}>

            <div onMouseUp={onMouseUp}
                 onKeyUp={onKeyUp}
                 onKeyDown={onKeyDown}>

                {props.children}

                {block?.content.type === 'markdown' && position && (
                    <div onClick={() => setPosition(undefined)}
                         style={{
                             position: 'absolute',
                             top: position.top,
                             left: position.left,
                             paddingTop: '5px',
                             paddingBottom: '5px'
                         }}>

                        <NoteFormatBar {...noteFormatHandlers}
                                       onDispose={() => setPosition(undefined)}
                                       onLink={props.onLink}/>

                    </div>
                )}

            </div>

        </ClickAwayListener>

    );

});
