import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IEventData = ckeditor5.IEventData;
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import { useNoteNavigationEnterHandler } from './NoteNavigationEnter';
import {NavOpts, NoteIDStr, useNotesStore} from "./store/NotesStore";
import { observer } from "mobx-react-lite"
import { NoteActivation } from './NoteActivation';

interface IProps {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

export const NoteNavigation = observer(function NoteNavigation(props: IProps) {

    const store = useNotesStore();

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const handleClickAway = React.useCallback(() => {
        // noop for now
    }, []);

    // TODO move to editor hook

    // TODO move to editor hook

    const handleClick = React.useCallback(() => {
        store.setActiveWithPosition(props.id, undefined);
    }, [props.id, store]);


    return (
        <>
            <NoteActivation id={props.id}/>
            <ClickAwayListener onClickAway={handleClickAway}>
                <div style={{flexGrow: 1}}
                     ref={setRef}
                     onClick={handleClick}>

                    {ref !== null && props.children}

                </div>
            </ClickAwayListener>
        </>
    );

});
