import * as React from "react";
import IEventData = ckeditor5.IEventData;
import IKeyPressEvent = ckeditor5.IKeyPressEvent;
import {NoteIDStr} from "./store/NotesStore";

interface IOpts {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
}

export function useNoteNavigationEnterHandler(opts: IOpts) {

    return React.useCallback((eventData: IEventData, event: IKeyPressEvent) => {

    }, []);

}
