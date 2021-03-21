import * as React from 'react';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import {CKEditor5BalloonEditor} from './ckeditor5/CKEditor5BalloonEditor';
import {CKEditor5GlobalCss} from "./ckeditor5/CKEditor5GlobalCss";
import { Numbers } from 'polar-shared/src/util/Numbers';
import {NoteContentEditable} from "../../../web/js/notes/textarea/NoteContentEditable";

// interface EditorsProps {
//     readonly
// }

const EDITOR_COUNT = 50;

const Editors = React.memo(() => {

    const epoch = React.useMemo(() => Date.now(), []);

    const loadedRef = React.useRef(0);

    const handleEditor = React.useCallback(() => {

        loadedRef.current = loadedRef.current + 1;

        if (loadedRef.current === EDITOR_COUNT) {
            const duration = Date.now() - epoch;
            console.log("Load editor duration: " + duration);
        }

    }, [epoch]);

    return (
        <>
            {Numbers.range(1, EDITOR_COUNT).map(idx => (
                <NoteContentEditable id="1234"
                                     parent={undefined}
                                     key={idx}
                                     content={`${idx} this is the <b>content</b> there are many like it but this one is mine.`}
                                     onChange={NULL_FUNCTION}/>))}
        </>
    );
});

export const MinimalContentEditablePerformanceStory = () => {

    return (
        <div>
            <Editors/>

        </div>
    );

}
