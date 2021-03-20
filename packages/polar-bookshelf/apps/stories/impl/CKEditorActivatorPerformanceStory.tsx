import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {CKEditor5BalloonEditor} from './ckeditor5/CKEditor5BalloonEditor';
import {CKEditor5GlobalCss} from "./ckeditor5/CKEditor5GlobalCss";
import { Numbers } from 'polar-shared/src/util/Numbers';
import {CKEditorActivator} from "./ckeditor5/CKEditorActivator";

const EDITOR_COUNT = 50;

const Editors = React.memo(() => {

    return (
        <>
            {Numbers.range(1, EDITOR_COUNT).map(idx => (
                <CKEditorActivator key={idx}
                                   content={`${idx} this is the <b>content</b> there are many like it but this one is mine.`}
                                   preEscaped={true}
                                   onChange={NULL_FUNCTION}
                                   onEditorMutator={NULL_FUNCTION}
                                   onEditor={NULL_FUNCTION}/>))}
        </>
    );
});

export const CKEditorActivatorPerformanceStory = () => {

    return (
        <div>
            <CKEditor5GlobalCss/>

            <Editors/>

        </div>
    );

}
