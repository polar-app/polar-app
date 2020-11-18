import React from "react";
import {useNoteMenuSelectedListener, useNoteMenuSelectedStore} from "../../../apps/stories/impl/NotesStory";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {useStateRef} from "../hooks/ReactHooks";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

interface IProps {
    readonly top: number;
    readonly left: number;

}

interface IMenuItem {
    readonly text: string;
    readonly action: () => void;
}

export const NoteActionMenu = React.memo((props: IProps) => {

    const[selectedMenuItem, setSelectedMenuItem, selectedMenuItemRef] = useStateRef<number | undefined>(undefined);

    const items: ReadonlyArray<IMenuItem> = React.useMemo(() =>
        [

            {text: "Embed", action: NULL_FUNCTION},
            {text: "Tomorrow", action: NULL_FUNCTION},
            {text: "Today", action: NULL_FUNCTION},
            {text: "Yesterday", action: NULL_FUNCTION}

        ], [])

    interface NoteMenuItemProps extends IMenuItem {
        readonly id: number;
    }

    const handleClick = React.useCallback((id: number) => {

        setSelectedMenuItem(undefined);
        items[id].action();

    }, [items, setSelectedMenuItem]);

    const NoteMenuItem = (props: NoteMenuItemProps) => {

        const {id} = props;

        return (
            <MenuItem onClick={() => handleClick(id)}
                      selected={selectedMenuItem === id}>
                <ListItemText primary={props.text} />
            </MenuItem>
        );

    };

    const handleKeyDown = React.useCallback((event: KeyboardEvent) => {

        switch (event.key) {
            case 'ArrowDown':
                console.log("FIXME: ArrowDown")
                setSelectedMenuItem(selectedMenuItemRef.current === undefined ? 0 : Math.min(items.length, selectedMenuItemRef.current + 1));
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'ArrowUp':
                console.log("FIXME: arrowUp")
                setSelectedMenuItem(Math.max(items.length, (selectedMenuItemRef.current || 0) - 1));
                event.preventDefault();
                event.stopPropagation();
                break;

            default:
                break;

        }

    }, [items.length, selectedMenuItemRef, setSelectedMenuItem]);


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
