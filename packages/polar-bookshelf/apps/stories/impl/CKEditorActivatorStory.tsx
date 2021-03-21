import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {CKEditorActivator} from "./ckeditor5/CKEditorActivator";
import {CKEditor5GlobalCss} from "./ckeditor5/CKEditor5GlobalCss";

export const CKEditorActivatorStory = () => {


    return (
        <div style={{flexGrow: 1}}>
            <CKEditor5GlobalCss/>

            <CKEditorActivator onEditorMutator={NULL_FUNCTION}
                               onEditor={NULL_FUNCTION}
                               onChange={NULL_FUNCTION}
                               content="this is <b>the</b> content"/>

        </div>
    )
}
