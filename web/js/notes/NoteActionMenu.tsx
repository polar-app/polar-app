import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import MenuList from "@material-ui/core/MenuList";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {useComponentDidMount, useComponentWillUnmount} from "../hooks/ReactLifecycleHooks";
import {useStateRef} from "../hooks/ReactHooks";

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

            {text: "Embed", action: () => console.log('Embed')},
            {text: "Tomorrow", action: () => console.log('Tomorrow')},
            {text: "Today", action: () => console.log('Today')},
            {text: "Yesterday", action: () => console.log('Yesterday')}

        ], [])

    interface NoteMenuItemProps extends IMenuItem {
        readonly id: number;
    }

    const executeCurrentAction = React.useCallback(() => {

        if (selectedMenuItemRef.current !== undefined) {
            items[selectedMenuItemRef.current].action();
        }

    }, [items, selectedMenuItemRef])

    const handleClick = React.useCallback((id: number) => {

        setSelectedMenuItem(undefined);
        executeCurrentAction();

    }, [executeCurrentAction, setSelectedMenuItem]);

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

        function computeNextID() {

            if (selectedMenuItemRef.current === undefined) {
                return 0;
            }

            return Math.min(items.length - 1, selectedMenuItemRef.current + 1);

        }


        function computePrevID() {

            if (selectedMenuItemRef.current === undefined) {
                return 0;
            }

            return Math.max(0, selectedMenuItemRef.current - 1);

        }

        switch (event.key) {
            case 'ArrowDown':

                const nextID = computeNextID();
                setSelectedMenuItem(nextID);
                event.preventDefault();
                event.stopPropagation();
                break;

            case 'ArrowUp':

                const prevID = computePrevID();
                setSelectedMenuItem(prevID);
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

    }, [executeCurrentAction, items.length, selectedMenuItemRef, setSelectedMenuItem]);


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
