import * as React from 'react';
import {CKEditor5} from "./ckeditor5/CKEditor5";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export const CKEditor5Story = () => {
    return (
        <CKEditor5 content='this is the content' onChange={NULL_FUNCTION}/>
    )
}