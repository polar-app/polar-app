import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import {useStateRef} from "../hooks/ReactHooks";
import { deepMemo } from "../react/ReactUtils";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";

export interface IActionMenuItem {

    /**
     * A unique id for the action so that we can handle it on the callback.
     */
    readonly id: string;
    readonly text: string;

}

export interface IActionMenuPosition {
    readonly top: number;
    readonly left: number;
}

interface IProps {

    /**
     * A provider for resolving the items that the user can select form their input.
     */
    readonly items: () => ReadonlyArray<IActionMenuItem>;


    readonly children: JSX.Element;

    readonly onItem: (item: IActionMenuItem) => void;

}

export const NoteActionMenu = deepMemo((props: IProps) => {

    const [position, setPosition, positionRef] = useStateRef<IActionMenuPosition | undefined>(undefined);
    const [, setMenuIndex, menuIndexRef] = useStateRef<number | undefined>(undefined);

    const items = props.items();

    const reset = React.useCallback(() => {
        setPosition(undefined);
        setMenuIndex(undefined);
    }, [setMenuIndex, setPosition]);

    const handleSelectedActionItem = React.useCallback(() => {

        if (menuIndexRef.current !== undefined) {
            const selectedItem = items[menuIndexRef.current];
            props.onItem(selectedItem)
        }

        setMenuIndex(undefined);
        setPosition(undefined);

    }, [items, menuIndexRef, props, setMenuIndex, setPosition])

    const onKeyDown = React.useCallback((event: React.KeyboardEvent) => {

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

            default:
                break;
        }

    }, [setPosition]);

    const computeNextMenuID = React.useCallback(() => {

        if (menuIndexRef.current === undefined) {
            return 0;
        }

        return Math.min(items.length - 1, menuIndexRef.current + 1);

    }, [items.length, menuIndexRef]);


    const computePrevMenuID = React.useCallback(() => {

        if (menuIndexRef.current === undefined) {
            return 0;
        }

        return Math.max(0, menuIndexRef.current - 1);

    }, [menuIndexRef]);

    const onKeyDownCapture = React.useCallback((event: KeyboardEvent) => {

        if (positionRef.current === undefined) {
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

    }, [computeNextMenuID, computePrevMenuID, handleSelectedActionItem, positionRef, reset, setMenuIndex]);

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

        <div onKeyDown={onKeyDown} onKeyUp={onKeyDown} onKeyPress={onKeyDown}>

            {position && (
                <ClickAwayListener onClickAway={() => setPosition(undefined)}>

                    <Paper elevation={3}
                           style={{
                               position: 'absolute',
                               top: position.top,
                               left: position.left
                           }}>

                        <MenuList>
                            {items.map((current, idx) => <NoteMenuItem key={idx}
                                                                       menuID={idx}
                                                                       {...current}/>)}
                        </MenuList>
                    </Paper>
                </ClickAwayListener>)}

            {props.children}
        </div>

    );
});
