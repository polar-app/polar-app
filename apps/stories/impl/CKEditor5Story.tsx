import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import { CKEditor5BalloonEditor } from './ckeditor5/CKEditor5BalloonEditor';

export const CKEditor5Story = () => {

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        console.log("key down: ", event.key);

    }, []);

    return (
        <div>

            {/*<h1>Balloon editor</h1>*/}
            <div onKeyDown={handleKeyDown}>
                <CKEditor5BalloonEditor content='this is the content' onChange={NULL_FUNCTION} onEditor={NULL_FUNCTION}/>
            </div>

            {/*<h1>Classic editor</h1>*/}
            {/*<div onKeyDown={handleKeyDown}>*/}
            {/*    <CKEditor5ClassicEditor content='this is the content' onChange={NULL_FUNCTION} onEditor={NULL_FUNCTION}/>*/}
            {/*</div>*/}
        </div>
    )
}