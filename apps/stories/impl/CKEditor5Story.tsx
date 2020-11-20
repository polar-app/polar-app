import * as React from 'react';
import {CKEditor5BalloonEditor} from "./ckeditor5/CKEditor5BalloonEditor";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const CKEditor5Story = () => {

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        console.log("key down: ", event.key);

    }, []);

    return (
        <div onKeyDown={handleKeyDown}>
            <CKEditor5BalloonEditor content='this is the content' onChange={NULL_FUNCTION} onEditor={NULL_FUNCTION}/>
        </div>
    )
}