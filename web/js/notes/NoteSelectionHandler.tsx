import * as React from 'react';
import { observer } from "mobx-react-lite"
import { useNotesStore } from './store/NotesStore';

interface IProps {
    readonly children: JSX.Element;
}

export const NoteSelectionHandler = observer(function NoteSelectionHandler(props: IProps) {

    const store = useNotesStore();

    const selected = store.selected;

    const handleDelete = React.useCallback((): boolean => {

        const deletable = Object.keys(selected);

        if (deletable.length > 0) {
            store.doDelete(deletable);
            return true;
        }

        return false;

    }, [selected, store]);

    const onKeyDown = React.useCallback((event: KeyboardEvent) => {

        switch (event.key) {

            case 'Backspace':
            case 'Delete':
                if (handleDelete()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                break;

            default:
                break;

        }

    }, [handleDelete]);

    React.useEffect(() => {

        // we hook the main window event listener because we have to override
        // all the key events to everything else once we are active.

        // FIXME: I think this is activating N times not for only the currently
        // active note ... there probably need to be two event listeners.
        //
        // the local one which is a normal event listener and listens for key
        // events as part of the normal dom and then one that listens at the
        // window level so it an abort events.

        window.addEventListener('keydown', onKeyDown, {capture: true})

        return () => {
            window.removeEventListener('keydown', onKeyDown, {capture: true})
        }

    }, [onKeyDown])

    return (
        <div>
            {props.children}
        </div>
    );

});
