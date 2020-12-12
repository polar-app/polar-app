import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import { useActiveKeyboardShortcutsCallbacks, useActiveKeyboardShortcutsStore } from '../../../web/js/hotkeys/ActiveKeyboardShortcutsStore';
import {useKeyboardShortcutsStore} from "../../../web/js/keyboard_shortcuts/KeyboardShortcutsStore";
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {KeySequence} from "../../../web/js/hotkeys/KeySequence";
import {KeySequences} from "../../../web/js/hotkeys/KeySequences";
import ListItemIcon from '@material-ui/core/ListItemIcon';


const ErrorRender = () => {

    const [failed, setFailed] = React.useState(false);

    setTimeout(() => setFailed(true), 1500);

    if (failed) {
        throw new Error("We failed")
    }

    return (
        <div>
            I'm about to die
        </div>
    );

}

interface ListItemRightProps {
    readonly children: JSX.Element;
}

const ListItemRight = React.memo((props: ListItemRightProps) => {
    return (
        <div style={{
                top: '50%',
                // right: '16px',
                right: '0px',
                position: 'absolute',
                transform: 'translateY(-50%)'
             }}>
            {props.children}
        </div>
    );
});

interface IProps {
    readonly icon?: React.ReactNode;
    readonly text: string;
    readonly selected?: boolean;
    readonly sequences: ReadonlyArray<string>;
    readonly onClick: () => void;
}

const ActionListItem = React.memo((props: IProps) => {

    return (
        <ListItem disableGutters
                  button
                  selected={props.selected}
                  onClick={props.onClick}
                  style={{padding: '5px'}}>

            {props.icon && (
                <ListItemIcon>
                    {props.icon}
                </ListItemIcon>)}

            {props.text}


            <ListItemRight>
                <KeySequences sequences={props.sequences}/>
            </ListItemRight>

        </ListItem>
    );

});

export const ScratchStory = () => {

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

                    // FIXME: only the first one is shown here.
                    return (
                        <ActionListItem key={key}
                                        text={shortcut.name}
                                        icon={shortcut.icon}
                                        selected={selected}
                                        sequences={shortcut.sequences}
                                        onClick={NULL_FUNCTION}/>
                    );
                })}

            </List>
        </div>

        // <MUIErrorBoundaryMessage/>
        // <DialogContent>
        //     <DialogTitle>this is the dialog</DialogTitle>
        // </DialogContent>

    )
}