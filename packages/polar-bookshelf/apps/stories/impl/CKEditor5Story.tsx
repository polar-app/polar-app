import * as React from 'react';
import {CKEditor5} from "./ckeditor5/CKEditor5";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const CKEditor5Story = () => {

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        console.log("key down: ", event.key);

    }, []);

    return (
        <div onKeyDown={handleKeyDown}>
            <CKEditor5 content='this is the content' onChange={NULL_FUNCTION} onEditor={NULL_FUNCTION}/>
        </div>
    )
}