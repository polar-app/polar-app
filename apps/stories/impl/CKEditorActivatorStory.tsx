import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {CKEditorActivator} from "./ckeditor5/CKEditorActivator";

export const CKEditorActivatorStory = () => {


    return (
        <div style={{flexGrow: 1}}>
            <CKEditorActivator onActivator={NULL_FUNCTION}
                               onActivated={NULL_FUNCTION}
                               content="this is <b>the</b> content"/>
        </div>
    )
}
