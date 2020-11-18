import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {useRefValue} from "../hooks/ReactHooks";
import {useNoteActionMenuStoreListener, useNoteActionMenuStore} from "./NoteActionMenuStore";

interface IProps {
    readonly top: number;
    readonly left: number;

}

interface IMenuItem {
    readonly text: string;
    readonly action: () => void;
}

export const NoteActionMenu = React.memo((props: IProps) => {

    const noteActionMenuStore = useNoteActionMenuStoreListener();
    const setNoteActionMenuStore = useNoteActionMenuStore();
    const menuIndexRef = useRefValue(noteActionMenuStore.menuIndex);

    const items: ReadonlyArray<IMenuItem> = React.useMemo(() =>
        [

            {text: "Embed", action: () => console.log('Embed')},
            {text: "Tomorrow", action: () => console.log('Tomorrow')},
            {text: "Today", action: () => console.log('Today')},
            {text: "Yesterday", action: () => console.log('Yesterday')}

        ], [])

    interface NoteMenuItemProps extends IMenuItem {
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

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {

        function computeNextID() {

            if (menuIndexRef.current === undefined) {
                return 0;
            }

            return Math.min(items.length - 1, menuIndexRef.current + 1);

        }


        function computePrevID() {

            if (menuIndexRef.current === undefined) {
                return 0;
            }

            return Math.max(0, menuIndexRef.current - 1);

        }

        switch (event.key) {
            case 'ArrowDown':

                const nextID = computeNextID();
                setMenuIndex(nextID);
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'ArrowUp':

                const prevID = computePrevID();
                setMenuIndex(prevID);
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'Enter':

                executeCurrentAction();

                event.preventDefault();
                event.stopPropagation();
                break;

            default:
                break;

        }

    }, [executeCurrentAction, items.length, menuIndexRef, setMenuIndex]);

    useComponentDidMount(() => {
        window.addEventListener('keydown', handleKeyDown);
    })

    useComponentWillUnmount(() => {
        window.removeEventListener('keydown', handleKeyDown);
    })

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
