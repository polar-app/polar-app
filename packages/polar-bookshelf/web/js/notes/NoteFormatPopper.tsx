import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import React from 'react';
import {BarMode, FormatBarActions, NoteFormatBar} from "./NoteFormatBar";
import {useNoteFormatHandlers, useNoteFormatKeyboardHandler} from "./NoteFormatHooks";
import {observer} from "mobx-react-lite"
import {ILTRect} from 'polar-shared/src/util/rects/ILTRect';
import {URLStr} from 'polar-shared/src/util/Strings';
import {createStyles, makeStyles} from '@material-ui/core';
import {reaction} from 'mobx';
import {useBlocksTreeStore} from './BlocksTree';
import {BlockIDStr} from "polar-blocks/src/blocks/IBlock";
import {BlockPredicates} from './store/BlockPredicates';

const useStyles = makeStyles((theme) =>
    createStyles({
        popper: {
            position: 'absolute',
            paddingTop: '5px',
            paddingBottom: '5px',
            zIndex: 10,
            transform: 'translateX(-50%)',
            userSelect: 'none',
        },
        fakeRange: {
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            backgroundColor: theme.palette.text.primary,
            opacity: 0.15,
        },
    }),
);

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

export interface IProps extends FormatBarActions {
    readonly id: BlockIDStr;
    readonly children: JSX.Element;

    readonly onUpdated: () => void;
}

export const NoteFormatPopper = observer(function NoteFormatPopper(props: IProps) {

    const [mode, setMode] = React.useState<BarMode>('format');
    const [position, setPosition] = React.useState<INoteFormatBarPosition | undefined>(undefined);
    const timeoutRef = React.useRef<number | undefined>(undefined);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const classes = useStyles();

    const {save, restore, getPosition} = useRangeSaver();
    const [fakeRangePosition, setFakeRangePosition] = React.useState<ILTRect | undefined>();

    const blocksTreeStore = useBlocksTreeStore();

    const block = blocksTreeStore.getBlock(props.id);
    const selected = blocksTreeStore.selected;
    const isBlockEditable = !! (block && BlockPredicates.isEditableBlock(block));

    const handleSetMode = React.useCallback((mode: BarMode) => {
        const container = containerRef.current;
        if (mode === 'link' && container) {
            save();
            setFakeRangePosition(getPosition(container));
        }
        setMode(mode);
    }, [setMode, save, containerRef, getPosition]);


    // FIXME listen to selected in the store and if it's not empty then clear the popup..

    const doPopup = React.useCallback((): boolean => {

        if (blocksTreeStore.hasSelected()) {
            return false;
        }

        const range = window.getSelection()!.getRangeAt(0);

        if (range.collapsed) {

            if (range) {
                setPosition(undefined);
            }

            return false;
        }

        const bcr = range.getBoundingClientRect();

        setPosition({
            top: bcr.bottom,
            bottom: bcr.top,
            left: bcr.left + bcr.width / 2,
        });

        return true;

    }, [setPosition, blocksTreeStore]);

    const clearPopup = React.useCallback(() => {

        setMode('format');
        setPosition(undefined);
        setFakeRangePosition(undefined);

    }, []);

    const clearPopupForKeyboard = React.useCallback(() => {

        clearPopup();

    }, [clearPopup])

    const noteFormatKeyboardHandler = useNoteFormatKeyboardHandler(isBlockEditable, clearPopupForKeyboard);

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

    const onMouseDown = React.useCallback(() => {
        window.addEventListener("mouseup", onMouseUp, {once: true});
    }, [onMouseUp]);

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
        if (event.ctrlKey && event.key === 'k') {
            event.stopPropagation();
            event.preventDefault();
            handleSetMode('link');
        } else {
            noteFormatKeyboardHandler(event);
        }
    }, [noteFormatKeyboardHandler, handleSetMode]);

    React.useEffect(() => {

        const dispose = reaction(() => blocksTreeStore.active?.id === props.id, (isActive) => {
            if (! isActive) {
                clearPopup();
            }
        });

        return () => dispose();
    }, [blocksTreeStore, clearPopup, props.id]);

    React.useEffect(() => {

        // FIXME: this just isn't being fired reliably

        if (blocksTreeStore.hasSelected()) {
            clearPopup();
        }

    }, [clearPopup, selected, blocksTreeStore]);

    const noteFormatHandlers = useNoteFormatHandlers(isBlockEditable, props.onUpdated);

    const onLink = React.useCallback((url: URLStr) => {
        restore();
        setFakeRangePosition(undefined);
        noteFormatHandlers.onLink(url);
    }, [noteFormatHandlers, restore]);

    return (

        <div onMouseDown={onMouseDown}
             onKeyUp={onKeyUp}
             onKeyDown={onKeyDown}
             ref={containerRef}>
                <div style={{ position: 'relative' }}>
                    {fakeRangePosition &&
                        <div className={classes.fakeRange} style={fakeRangePosition}></div>}

                    {props.children}
                </div>

                {isBlockEditable && position && (
                    <ClickAwayListener onClickAway={clearPopup}>
                        <div className={classes.popper}
                             style={{
                                 top: position.top,
                                 left: position.left,
                             }}>

                            <NoteFormatBar {...noteFormatHandlers}
                                           onDispose={clearPopup}
                                           mode={mode}
                                           setMode={handleSetMode}
                                           onLink={onLink}/>

                        </div>
                    </ClickAwayListener>
                )}

        </div>


    );

});

const useRangeSaver = () => {
    const rangeRef = React.useRef<Range | undefined>();
    const save = React.useCallback((): boolean => {
        const selection = document.getSelection();
        if (selection && selection.rangeCount > 0) {
            rangeRef.current = selection.getRangeAt(0);
            return true;
        }
        return false;
    }, [rangeRef]);

    const restore = React.useCallback((): boolean => {
        const selection = document.getSelection();
        if (selection && rangeRef.current) {
            selection.removeAllRanges();
            selection.addRange(rangeRef.current);
            return true;
        }
        return false;
    }, [rangeRef]);

    const getPosition = React.useCallback((container: HTMLElement): ILTRect | undefined => {
        const range = rangeRef.current;
        if (!range) {
            return undefined;
        }
        const rangeRect = range.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        return {
            left: rangeRect.left - containerRect.left,
            top: rangeRect.top - containerRect.top,
            width: rangeRect.width,
            height: rangeRect.height,
        };
    }, []);

    return { save, restore, getPosition };
};
