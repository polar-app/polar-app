import {
    useActiveKeyboardShortcutsCallbacks,
    useActiveKeyboardShortcutsStore
} from "../../hotkeys/ActiveKeyboardShortcutsStore";
import {useKeyboardShortcutsStore} from "../../keyboard_shortcuts/KeyboardShortcutsStore";
import * as React from "react";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import { MUICommandMenuItem } from "./MUICommandMenuItem";

interface IProps {

}

export const MUICommandMenu = () => {

    const {index, filter} = useActiveKeyboardShortcutsStore(['index', 'filter']);
    const {setFilter, setIndex} = useActiveKeyboardShortcutsCallbacks();
    const {shortcuts} = useKeyboardShortcutsStore(['shortcuts'])

    const filtered = Object.values(shortcuts)
        .filter(shortcut => filter === undefined || shortcut.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        if (event.shiftKey || event.ctrlKey || event.metaKey) {
            // we only work with the raw keys.
            return;
        }

        function stopEvent() {
            event.stopPropagation();
            event.preventDefault();
        }

        function computeNewIndex(delta: number) {

            if (index === undefined) {

                if (delta === 1) {
                    // go to the start
                    return 0;
                }

                if (index === -1) {
                    // got to the end
                    return filtered.length - 1;
                }

                return 0;

            }

            const newIndex = index + delta;

            if (newIndex < 0) {
                return filtered.length - 1;
            }

            if (newIndex >= filtered.length) {
                return 0;
            }

            return newIndex;

        }

        function handleNewIndex(delta: number) {
            const newIndex = computeNewIndex(delta);
            setIndex(newIndex);
        }

        if (event.key === 'ArrowDown') {
            stopEvent();
            handleNewIndex(1);
        }

        if (event.key === 'ArrowUp') {
            stopEvent();
            handleNewIndex(-1);
        }

    }, [filtered.length, index, setIndex]);

    return (

        <div style={{display: 'flex', flexDirection: 'column', width: '600px'}}>

            <TextField autoFocus={true}
                       onKeyDown={handleKeyDown}
                       onChange={event => setFilter(event.target.value) }/>

            <List component="nav">

                {filtered.map((shortcut, idx) => {

                    const selected = index === idx;
                    const key = (shortcut.group || '') + ':' + shortcut.name + ':' + selected;

                    return (
                        <MUICommandMenuItem key={key}
                                            text={shortcut.name}
                                            icon={shortcut.icon}
                                            selected={selected}
                                            sequences={shortcut.sequences}
                                            onClick={NULL_FUNCTION}/>
                    );
                })}

            </List>
        </div>


    )
}