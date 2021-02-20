import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {CKEditor5BalloonEditor} from './ckeditor5/CKEditor5BalloonEditor';
import {CKEditor5GlobalCss} from "./ckeditor5/CKEditor5GlobalCss";
import { Numbers } from 'polar-shared/src/util/Numbers';
import {MinimalContentEditable} from "../../../web/js/notes/textarea/MinimalContentEditable";

export const MinimalContentEditableStory = () => {

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {

        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
        }

    }, []);

    return (
        <div>
            <MinimalContentEditable id="1234"
                                    content="this is the content"
                                    onKeyDown={handleKeyDown}
                                    onChange={NULL_FUNCTION}/>

        </div>
    );

}
