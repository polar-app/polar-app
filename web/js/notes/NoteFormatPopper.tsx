import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import React from 'react';
import {NoteFormatBar, NoteFormatBarProps} from "./NoteFormatBar";
import {useNoteFormatHandlers} from "./NoteFormatHooks";

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
    readonly children: JSX.Element;

    readonly onUpdated: () => void;

}

export const NoteFormatPopper = React.memo((props: IProps) => {

    const [position, setPosition] = React.useState<INoteFormatBarPosition | undefined>(undefined);

    const doPopup = React.useCallback((): boolean => {

        const range = window.getSelection()!.getRangeAt(0);

        // range.collaopsed doesn't always work...
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

    }, [position]);

    const onMouseUp = React.useCallback(() => {

        doPopup();

    }, [doPopup]);

    const onKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        doPopup();

        if (event.key === 'Escape') {
            setPosition(undefined);
        }

    }, [doPopup]);

    const noteFormatHandlers = useNoteFormatHandlers(props.onUpdated);

    return (
        <ClickAwayListener onClickAway={() => setPosition(undefined)}>

            <div onMouseUp={onMouseUp} onKeyUp={onKeyUp}>
                {props.children}

                {position && (
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
