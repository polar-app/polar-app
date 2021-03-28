import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {NoteContentEditable} from "../../../web/js/notes/contenteditable/NoteContentEditable";

export const MinimalContentEditableStory = () => {

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
        }

    }, []);

    return (
        <div>
            <NoteContentEditable id="1234"
                                 parent={undefined}
                                 content="this is the content"
                                 onKeyDown={handleKeyDown}
                                 onChange={NULL_FUNCTION}/>

        </div>
    );

}
