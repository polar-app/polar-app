import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import {useRefValue} from "../hooks/ReactHooks";
import {useNoteActionMenuStoreListener, useNoteActionMenuStore} from "./NoteActionMenuStore";
import { deepMemo } from "../react/ReactUtils";

export interface IActionMenuItem {

    /**
     * A unique id for the action so that we can handle it on the callback.
     */
    readonly id: string;
    readonly text: string;

}

interface IProps {
    readonly top: number;
    readonly left: number;
    readonly items: ReadonlyArray<IActionMenuItem>;
}

export const NoteActionMenu = deepMemo((props: IProps) => {

    const noteActionMenuStore = useNoteActionMenuStoreListener();
    const setNoteActionMenuStore = useNoteActionMenuStore();
    const menuIndexRef = useRefValue(noteActionMenuStore.menuIndex);

    const {items} = props;

    interface NoteMenuItemProps extends IActionMenuItem {
        readonly id: number;
    }

    const setMenuIndex = React.useCallback((menuIndex: number | undefined) => {
        setNoteActionMenuStore({...noteActionMenuStore, menuIndex})
    }, [noteActionMenuStore, setNoteActionMenuStore]);

    const executeCurrentAction = React.useCallback(() => {

        if (menuIndexRef.current !== undefined) {
            items[menuIndexRef.current].action();
        }

        setMenuIndex(undefined);

    }, [items, menuIndexRef, setMenuIndex])

    const handleClick = React.useCallback(() => {

        setMenuIndex(undefined);
        executeCurrentAction();

    }, [executeCurrentAction, setMenuIndex]);

    const NoteMenuItem = (props: NoteMenuItemProps) => {

        const {id} = props;

        return (
            <MenuItem onClick={handleClick}
                      selected={menuIndexRef.current === id}>
                <ListItemText primary={props.text} />
            </MenuItem>
        );

    };

    return (

        <Paper elevation={3}
               style={{
                   position: 'absolute',
                   top: props.top,
                   left: props.left
               }}>

            <MenuList>
                {items.map((current, idx) => <NoteMenuItem key={idx}
                                                           id={idx}
                                                           {...current}/>)}
            </MenuList>
        </Paper>

    );
});
